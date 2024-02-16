import axios from "axios";
import jwt from "jsonwebtoken";
import { SECRET } from "../../config/tokenSecret.js";
import { tokenType } from "../interfaces/adminInterface.js";
import { tokenAdminToken } from "../interfaces/eventInterface.js";
import { NextFunction, Response, Request } from "express";

export const AuthourizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token: string = (authHeader && authHeader.split(" ")[1]) || "";
  jwt.verify(token, SECRET, (err, data) => {
    if (err) return res.send({ status: 403 });
    req.body.admin = data;
    next();
  });
};

export const AuthourizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token: string = (authHeader && authHeader.split(" ")[1]) || "";
  const getPayload = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`;
  try {
    const response = await axios.get(getPayload);
    req.body.user = { email: response.data.email };
    next();
  } catch (err) {
    return res.status(401).send("Bad Token")
  }
};

export const CreateAdminToken = async (req: Request, res: Response) => {
  const tokenData: tokenType = {
    is_admin: true,
    user: { email: req.body.uname },
  };
  const token: string = jwt.sign(tokenData, SECRET);
  return res.send({ token: token });
};

export const CreateEventAdminToken = async (req: Request, res: Response) => {
  const tokenData: tokenAdminToken = {
    is_event_admin: true,
    event_id: req.body.event_id,
  };
  const token: string = jwt.sign(tokenData, SECRET);
  return res.send({ token: token });
};
