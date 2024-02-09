import { pool } from "../../config/db.js";
import { 
    NextFunction, 
    Request, 
    Response 
} from "express";
import { 
    allowIfPaid, 
    updatePaid, 
    insertAdmin, 
    getAdminPassword, 
    getEventAdminPassword, 
    getUsersforEvent
} from "../queries/adminQueries.js";
import bcrypt from "bcrypt"

const UpdatePaid = async (req: Request, res: Response) => {
  if(req.body.admin.is_admin) {
    const { user_email } = req.body;
    const client = await pool.connect();
    await client.query(updatePaid, [user_email])
    client.release();
    return res.status(200)
  } else
    return res.status(401)
};

const VerifyPaid = async (req: Request, res: Response) => {
  if(req.body.admin.is_event_admin) {
  const { user_email } = req.body;
  const { event_id } = req.body.admin;
  const client = await pool.connect();
  const result = await client.query(allowIfPaid, [user_email, event_id]);
  client.release();
  if (result.rows.length == 1)
    return res.status(200)
  else return res.status(404)
  } else
    return res.status(401)
};

const UserSignUp = async (req: Request, res: Response) => {
  const {uname, password} = req.body
  const hashedPass = await bcrypt.hash(password, 10)
  const client = await pool.connect()
  await client.query(insertAdmin, [uname, hashedPass])
  client.release()
  return res.status(200)
};

const UserLogIn = async (req: Request, res: Response, next: NextFunction) => {
  const {uname, password} = req.body
  const client = await pool.connect()
  const data = await client.query(getAdminPassword, [uname])
  client.release()
  if(data.rows.length == 0) return res.status(400).send("User not found")
  const user = data.rows[0]
  if(await bcrypt.compare(password, user.password)) next()
  else return res.status(401).send("Wrong password")
}

const EventLogin = async (req: Request, res: Response, next: NextFunction) => {
  const {event_id, password} = req.body
  const client = await pool.connect()
  const data = await client.query(getEventAdminPassword, [event_id])
  client.release()
  if(data.rows.length == 0) return res.status(400).send("User not found")
  const user = data.rows[0]
  if(await bcrypt.compare(password, user.password)) next()
  else return res.status(401).send("Wrong password")
}

const GetUsersFromEvent = async (req: Request, res: Response) => {
  const client = await pool.connect()
  const {event_id} = req.body.admin
  const data = await client.query(getUsersforEvent,[event_id])
  return res.status(200).send(data.rows)
}

export { UpdatePaid, VerifyPaid, UserSignUp, UserLogIn, EventLogin, GetUsersFromEvent };
