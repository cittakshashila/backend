import { Response, Request } from "express";
import { pool } from "../../config/db.js";
import {
  createEvent,
} from "../queries/eventQueries.js";

const CreateEvent = async (req: Request, res: Response) => {
  if(req.body.admin.is_super_admin){
    const { event_id, name, fee, pass_id} = req.body
    const client = await pool.connect()
    await client.query(createEvent, [event_id, name, fee, pass_id])
    return res
      .status(200)
      .json({ status: 200, body: { message: "Sucessfull" } });
  }else
    return res
      .status(403)
      .json({ status: 403, body: { message: "Not Authorized" } });
};

export {
  CreateEvent,
};
