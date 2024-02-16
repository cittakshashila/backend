import { pool } from "../../config/db.js";
import { NextFunction, Request, Response } from "express";
import {
  allowIfPaid,
  updatePaid,
  insertAdmin,
  getAdminPassword,
  getEventAdminPassword,
  getUsersforEvent,
  insertEvent
} from "../queries/adminQueries.js";
import {
  EventIdValidator,
  EventLoginValidator,
  UserEmailValidator,
  UserSignUpValidator,
} from "../validators/adminValidators.js";
import bcrypt from "bcrypt";
import {
    begin,
    commit,
    deleteFromCart,
    insertMissingOnes,
    rollback
} from "../queries/userQueries.js";
import {PostgresError} from "../interfaces/userInterface.js";

const UpdatePaid = async (req: Request, res: Response) => {
  if (req.body.admin.is_admin) {
    const user = UserEmailValidator.parse(req.body);
    const client = await pool.connect();
    await client.query(updatePaid, [user.user_email]);
    client.release();
    return res.sendStatus(200)
  } else return res.sendStatus(401);
};

const VerifyPaid = async (req: Request, res: Response) => {
  if (req.body.admin.is_event_admin) {
    const user_email = UserEmailValidator.parse(req.body);
    const event_id = EventIdValidator.parse(req.body.admin);
    const client = await pool.connect();
    const result = await client.query(allowIfPaid, [user_email, event_id]);
    client.release();
    if (result.rows.length == 1) return res.sendStatus(200);
    else return res.sendStatus(404)
  } else return res.sendStatus(401);
};

const UserSignUp = async (req: Request, res: Response) => {
  const { uname, password } = UserSignUpValidator.parse(req.body);
  const hashedPass = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  await client.query(insertAdmin, [uname, hashedPass]);
  client.release();
  return res.sendStatus(200);
};

const UserLogIn = async (req: Request, res: Response, next: NextFunction) => {
  const { uname, password } = UserSignUpValidator.parse(req.body);
  const client = await pool.connect();
  const data = await client.query(getAdminPassword, [uname]);
  client.release();
  if (data.rows.length == 0)
    return res.status(400).send("User not found");
  const user = data.rows[0];
  if (await bcrypt.compare(password, user.password)) next();
  else return res.status(401).send("Wrong password");
};

const EventLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id, password } = EventLoginValidator.parse(req.body);
  const client = await pool.connect();
  const data = await client.query(getEventAdminPassword, [event_id]);
  client.release();
  if (data.rows.length == 0)
    return res.status(400).send("User not found");
  const user = data.rows[0];
  if (await bcrypt.compare(password, user.password)) next();
  else return res.status(401).send("Wrong password");
};

const GetUsersFromEvent = async (req: Request, res: Response) => {
  if (req.body.admin.is_event_admin) {
    const client = await pool.connect();
    const {event_id}  = EventIdValidator.parse(req.body.admin);
    const data = await client.query(getUsersforEvent, [event_id]);
    return res.status(200).send(data.rows);
  }
};


const UpdateUserCart = async ( req: Request, res: Response ) => {
  if(req.body.admin.is_admin){
    const { events_id, user_email } = req.body;
    const client = await pool.connect();
    try {
      console.log(events_id)
      const client = await pool.connect();
      await client.query(begin);
      await client.query(insertMissingOnes, [user_email, events_id]);
      await client.query(deleteFromCart, [user_email, events_id]);
      await client.query(commit);
      return res.status(200).send("Cart Updated")
    } catch (err) {
      await client.query(rollback);
      if (err && ((err as PostgresError).code === "23503")) {
        console.log(err)
        return res.status(550).send("No such user")
      }
      return res.status(404).send("Error with connection")
    }
  }
};

const CreateEvent = async(req: Request, res: Response) => {
  const {name, id, pass_id, fee, password} = req.body
  const hashedPass = await bcrypt.hash(password, 10);
  const client = await pool.connect()
  await client.query(insertEvent, [name, id, fee, pass_id, hashedPass])
  return res.sendStatus(200)
}

export {
  UpdatePaid,
  VerifyPaid,
  UserSignUp,
  UserLogIn,
  EventLogin,
  GetUsersFromEvent,
  UpdateUserCart,
  CreateEvent
};
