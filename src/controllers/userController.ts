import { pool } from "../../config/db.js";
import { cartType, PostgresError } from "../interfaces/userInterface.js";
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
import { NextFunction, Request, Response } from "express";
import {
  createUserValidator,
  emailValidator,
} from "../validators/userValidators.js";

const GetUserDetails = async (req: Request, res: Response) => {
  const { email } = emailValidator.parse(req.body.user);
  const client = await pool.connect();
  const result = await client.query(getUserDetails, [email]);
  client.release()
  return res.status(200).json({
    statusCode: 200,
    body: { message: "Request Sucessfull", data: result.rows },
  });
};

const CreateUser = async (req: Request, res: Response) => {
  try{
     const data = createUserValidator.parse(req.body);
     const user = emailValidator.parse(req.body.user);
     const sql_arr = [data.name, user.email, data.phone_no, data.clg_name];
     const client = await pool.connect();
     await client.query(createUser, [...sql_arr]).then(() => {
       client.release();
     });
     return res
       .status(200)
       .json({ statusCode: 200, message: "User Created Sucessfully" });
  }catch(err){
    if (err && (err as PostgresError).code === "23505")
      return res
        .status(550)
        .json({ statusCode: 550, body: { message: "User Already Found" } });
    }
    return res
      .status(500)
      .json({ statusCode: 500, body: { message: "Internal Server Error" } });
};

const GetUserCart = async (req: Request, res: Response) => {
  const { email } = emailValidator.parse(req.body.user);
  const client = await pool.connect();
  const data = await client.query(getCart, [email]);
  client.release()
  let cartItems: Record<string, Array<cartType>> = {};
  data.rows.forEach((event: cartType) => {
    if (!cartItems[event.pass_id]) cartItems[event.pass_id] = [];
    cartItems[event.pass_id].push(event);
  });
  return res.status(200).json({
    statusCode: 200,
    body: { message: "Cart Retrieved Sucessfullu", data: cartItems },
  });
};

const UpdateUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = emailValidator.parse(req.body.user);
  const { events_id } = req.body;
  const client = await pool.connect();
  try {
    const client = await pool.connect();
    await client.query(begin);
    await client.query(insertMissingOnes, [email, events_id]);
    await client.query(deleteFromCart, [email, events_id]);
    await client.query(commit);
    client.release()

    return res.status(200).json({
      statusCode: 200,
      body: { message: "User Cart Updated Sucessfully" },
    });
  } catch (err) {
    await client.query(rollback);
    if (err && (err as PostgresError).code === "23503" && 
        (err as PostgresError).constraint === "users_events_user_email_fkey") {
      return res
        .status(551)
        .json({ statusCode: 551, body: { message: "User Not Found" } });
    }else if(err && (err as PostgresError).code === "23503" && 
        (err as PostgresError).constraint === "users_events_event_id_fkey"){
      return res
        .status(552)
        .json({ statusCode: 552, body: { message: "Event Not Found" } });
    }
    next(err);

    return res
      .status(500)
      .send({ statusCode: 500, body: { message: "Internal Server Error" } });
  }
};

export { CreateUser, GetUserCart, GetUserDetails, UpdateUserCart };
