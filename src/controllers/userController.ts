import { pool } from "../../config/db.js";
import { PostgresError } from "../interfaces/userInterface.js";
import {
  begin,
  commit,
  createUser,
  getUserDetails,
  rollback,
  getCart,
  insertMissingOnes,
  deleteFromCart,
} from "../queries/userQueries.js";
import { 
    NextFunction,
    Request,
    Response 
} from "express";
import {
  createUserValidator,
  emailValidator,
} from "../validators/userValidators.js";

const GetUserDetails = async (req: Request, res: Response) => {
  const {email} = emailValidator.parse(req.body.user);
  const client = await pool.connect();
  const result = await client.query(getUserDetails, [email]);
  return res.send({ data: result.rows, "status": 200 });
};

const CreateUser = async (req: Request, res: Response) => {
  const data = createUserValidator.parse(req.body);
  const user = emailValidator.parse(req.body.user)
  const sql_arr = [data.name, user.email, data.phone_no, data.clg_name];
  const client = await pool.connect();
  await client.query(createUser, [...sql_arr])
    .then(() => {
      client.release();
    });
  return res.send({ "status": 200 });
};

const GetUserCart = async (
  req: Request,
  res: Response
) => {
  const {email} = emailValidator.parse(req.body.user);
  const client = await pool.connect();
  const data = await client.query(getCart,[email])
  return res.send({"status": 200, "data" : data.rows});
};

const UpdateUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = emailValidator.parse(req.body.user);
  const { events_id } = req.body
  const client = await pool.connect();
  try {
    const client = await pool.connect()
    await client.query(begin)
    await client.query(insertMissingOnes,[email,events_id])
    await client.query(deleteFromCart,[email,events_id])
    await client.query(commit)
    return res.send({"status":200})
  } catch (err) {
    await client.query(rollback);
    if (err && ((err as PostgresError).code === "23503")) {
      console.log(err)
      return res.send({ "status": 404 });
    }
    next(err)
    return res.send({"status":500})
  }
};

export { CreateUser, GetUserCart, GetUserDetails, UpdateUserCart };
