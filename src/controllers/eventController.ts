import { Response, Request } from "express";
import { pool } from "../../config/db.js";
import {
  createEvent,
  editEvent
} from "../queries/eventQueries.js";

const CreateEvent = async (req: Request, res: Response) => {
  if(req.body.admin.is_super_admin){
    const { event_id, name, fee, pass_id} = req.body
    const client = await pool.connect()
    await client.query(createEvent, [event_id, name, fee, pass_id])
    client.release()
    return res
      .status(200)
      .json({ status: 200, body: { message: "Sucessfull" } });
  }else
    return res
      .status(403)
      .json({ status: 403, body: { message: "Not Authorized" } });
};

const UpdateEvent = async (req: Request, res: Response) => {
  if(req.body.admin.is_super_admin || (req.body.admin.events_id.includes(req.body.event_id))){
    const client = await pool.connect()
    try{
      const { event_id, name, fee, pass_id} = req.body
      const data = await client.query(editEvent, [event_id, name, fee, pass_id])
      client.release()
      if(data.rows.length == 1)
        return res
          .status(200)
          .json({ status: 200, body: { message: "Updated Sucessfull" } });
      else
        return res
          .status(500)
          .json({ status: 500, body: { message: "Event doesnot exist" } });
    } catch(err){
      client.release()
      return res
        .status(500)
        .json({ status: 500, body: { message: "Event not updated" } });
    }
  }else
    return res
      .status(403)
      .json({ status: 403, body: { message: "Not Authorized" } });
};

export {
  CreateEvent,
  UpdateEvent
};
