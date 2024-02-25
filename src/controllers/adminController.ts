import { pool } from "../../config/db.js";
import { NextFunction, Request, Response } from "express";
import {
  allowIfPaid,
  updatePaid,
  insertAdmin,
  getAdminPassword,
  getEventAdminPassword,
  getUsersforEvent,
  insertEvent,
  addEventAdmin,
  insertEvents4Admin,
  getAdminEvents
} from "../queries/adminQueries.js";
import {
  EventIdValidator,
  EventLoginValidator,
  UserEmailValidator,
  UserSignUpValidator,
} from "../validators/adminValidators.js";
import bcrypt from "bcryptjs";
import {
  begin,
  commit,
  deleteFromCart,
  insertMissingOnes,
  rollback,
} from "../queries/userQueries.js";
import { PostgresError } from "../interfaces/userInterface.js";

/* THIS IS THE ROUTE FOR TOGGLE THE USER TO BE PAID ON FRONT DESK
 */
const UpdatePaid = async (req: Request, res: Response) => {
  if (!req.body.admin.is_admin) {
    return res
      .status(401)
      .json({ statusCode: 401, body: { message: "Unauthorized Request" } });
  }

  const user = UserEmailValidator.parse(req.body);

  const client = await pool.connect();
  await client.query(updatePaid, [user.user_email]);
  client.release();

  return res
    .status(200)
    .json({ statusCode: 200, body: { message: "Sucessfull" } });
};

/*   TO ALLOW USERS TO THE EVENT
 */
const VerifyPaid = async (req: Request, res: Response) => {
  if (!req.body.admin.is_event_admin) {
    return res
      .status(401)
      .json({ statusCode: 401, body: { message: "UnAuthorized Request" } });
  }

  const { user_email } = UserEmailValidator.parse(req.body);
  const { event_id } = EventIdValidator.parse(req.body);

  if(req.body.admin.is_super_admin || (req.body.admin.events_id.includes(event_id))){
    const client = await pool.connect();
    const result = await client.query(allowIfPaid, [user_email, event_id]);
    client.release();

    if (result.rows.length == 1)
      return res
        .status(200)
        .json({ statusCode: 200, body: { message: "Sucessfull" } });
    else
      return res.status(404).json({
        statusCode: 404,
           body: { message: "User not Paid, User not allowed" },
        });
  }else{
      return res.status(401).json({
        statusCode: 401,
           body: { message: "Admin not Authorized" },
        });
  }
};

/*  TO CREATE USER - "USER REGISTRATION"
 */
const UserSignUp = async (req: Request, res: Response) => {
  const { uname, password } = UserSignUpValidator.parse(req.body);

  const hashedPass = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  await client.query(insertAdmin, [uname, hashedPass]);

  client.release();

  return res
    .status(200)
    .json({ statusCode: 200, body: { message: "Sucessfull" } });
};

/*  FOR USER LOGIN AS ADMIN IN THE FRONT DESK
 */
const UserLogIn = async (req: Request, res: Response, next: NextFunction) => {
  const { uname, password } = UserSignUpValidator.parse(req.body);

  const client = await pool.connect();
  const data = await client.query(getAdminPassword, [uname]);
  client.release();

  if (data.rows.length == 0)
    return res
      .status(400)
      .json({ statusCode: 400, body: { message: "Bad Request" } });

  const user = data.rows[0];
  if (await bcrypt.compare(password, user.password)) next();
  else
    return res
      .status(401)
      .json({ statusCode: 401, body: { message: "Wrong Password" } });
};

/*  FOR EVENT CORDINATOR LOGIN
 */
const EventLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { admin_id, password } = EventLoginValidator.parse(req.body);

  const client = await pool.connect();
  const data = await client.query(getEventAdminPassword, [admin_id]);

  client.release();

  if (data.rows.length == 0)
    return res
      .status(400)
      .json({ statusCode: 400, body: { message: "No Such Admin" } });

  const user = data.rows[0];
  if (await bcrypt.compare(password, user.password)){
    const events = await client.query(getAdminEvents, [admin_id])
    let events_id : Array<string> = []
    events.rows.forEach(ele=>events_id.push(ele.event_id))
    req.body.events_id = events_id
    next();
  }
  else
    return res
      .status(401)
      .json({ statusCode: 401, body: { message: "Wrong Password" } });
};

/*  FOR GETTING USERS FROM A PARTICULAR EVENT */
const GetUsersFromEvent = async (req: Request, res: Response) => {
  if (!req.body.admin.is_event_admin && (req.body.admin.events_id.includes(req.params.event_is))) {
    return res
      .status(401)
      .json({ statusCode: 401, body: { message: "UnAuthorized Request" } });
  }

  const client = await pool.connect();
  const { event_id } = EventIdValidator.parse(req.params);
  const data = await client.query(getUsersforEvent, [event_id]);

  return res.status(200).json({
    statusCode: 200,
    body: { message: "Sucessfull", data: data.rows },
  });
};

/*
 *  UPDATE USERS CART FROM FRONT DESK
 */
const UpdateUserCart = async (req: Request, res: Response) => {
  if (req.body.admin.is_admin) {
    const { events_id, user_email } = req.body;
    const client = await pool.connect();

    try {
      const client = await pool.connect();
      await client.query(begin);
      await client.query(insertMissingOnes, [user_email, events_id]);
      await client.query(deleteFromCart, [user_email, events_id]);
      await client.query(commit);

      return res.status(200).json({
        statusCode: 200,
        body: { message: "Sucessfully updated cart" },
      });
    } catch (err) {
      await client.query(rollback);
      if (err && (err as PostgresError).code === "23503") {
        return res
          .status(400)
          .json({ statusCode: 400, body: { message: "No Such User Exist" } });
      }
      return res
        .status(500)
        .json({ statusCode: 500, body: { message: "Internal Server Error" } });
    }
  }
};

/*/
 * TO CREATE EVENT FOR ADMINS
 */
const CreateEvent = async (req: Request, res: Response) => {
  const { name, id, pass_id, fee, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  await client.query(insertEvent, [name, id, fee, pass_id, hashedPass]);

  return res
    .status(200)
    .json({ statusCode: 200, body: { message: "Sucessfull" } });
};

const EventAdminSignUp = async(req: Request, res: Response) => {
  const client = await pool.connect()
  try{
    const {admin_id, password, events_id} = req.body
    const hashedPass = await bcrypt.hash(password, 10);
    await client.query(begin)
    await client.query(addEventAdmin, [admin_id, hashedPass])
    await client.query(insertEvents4Admin, [admin_id, events_id])
    await client.query(commit)
    return res
      .status(200)
      .json({ statusCode: 200, body: { message: "Admin added with Events ID" } });
  }catch(err){
    console.log(err)
    await client.query(rollback)
    return res
      .status(500)
      .json({ statusCode: 500, body: { message: "Something went wrong" } });
  }
}

export {
  UpdatePaid,
  VerifyPaid,
  UserSignUp,
  UserLogIn,
  EventLogin,
  GetUsersFromEvent,
  UpdateUserCart,
  CreateEvent,
  EventAdminSignUp
};
