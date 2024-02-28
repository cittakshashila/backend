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
  let result;
  try{
    result = await client.query(getUserDetails, [email]);
  }catch(err){
    return res.status(500).json({
      statusCode: 500,
      body: { message: "Good Server Error" },
    });
  }finally{
    client.release()
  }
    return res.status(200).json({
      statusCode: 200,
      body: { message: "Request Sucessfull", data: result.rows },
    });
};

const CreateUser = async (req: Request, res: Response) => {
  const client = await pool.connect();
  let status = 200;
  let message = "User Created Sucessfully"
  try{
     const data = createUserValidator.parse(req.body);
     const user = emailValidator.parse(req.body.user);
     const sql_arr = [data.name, user.email, data.phone_no, data.clg_name];
     await client.query(createUser, [...sql_arr])
  }catch(err){
    if (err && (err as PostgresError).code === "23505"){
        status = 550;
        message = "User Already Found"
    }else{
        status = 500;
        message = "Good Internal Server Error"
    } 
  }finally{
      client.release()
      return res
        .status(status)
        .json({ statusCode: status, message });
  }
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
  res: Response
) => {
  const { email } = emailValidator.parse(req.body.user);
  const { events_id } = req.body;
  const client = await pool.connect();
  let status = 200;
  let message = "User Cart Updated Sucessfully"
  try {
    await client.query(begin);
    await client.query(insertMissingOnes, [email, events_id]);
    await client.query(deleteFromCart, [email, events_id]);
    await client.query(commit);
  } catch (err) {
    await client.query(rollback);
    if (err && (err as PostgresError).code === "23503" && 
        (err as PostgresError).constraint === "users_events_user_email_fkey") {
        status = 551;
        message = "User Not Found"
    }else if(err && (err as PostgresError).code === "23503" && 
        (err as PostgresError).constraint === "users_events_event_id_fkey"){
        status = 552;
        message = "Event Not Found"
    }else{
      status = 500;
      message = "Good Internal Server Error"
    }
  }finally{
    client.release()
    return res.status(status).json({
      statusCode: status,
      body: { message },
    });
  }
};

export { CreateUser, GetUserCart, GetUserDetails, UpdateUserCart };
