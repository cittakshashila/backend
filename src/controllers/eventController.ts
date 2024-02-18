import { Response, Request } from "express";
import { pool } from "../../config/db.js";
import { Events, EventsHome } from "../interfaces/eventInterface.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventDetails,
  updateEvent,
} from "../queries/eventQueries.js";
import { EventIdValidator } from "../validators/eventValidators.js";
const eventProperties = [
  "name",
  "description",
  "tag_line",
  "rules",
  "img_link",
  "fee",
  "date",
  "team_size",
  "youtube",
  "instagram",
  "first_prize",
  "second_prize",
  "third_prize",
  "is_paid",
];

const GetAllEvents = async (_: Request, res: Response) => {
  const client = await pool.connect();
  const result = await client.query(getAllEvents);
  const events: Array<EventsHome> = result.rows;
  client.release();

  return res
    .status(200)
    .json({ status: 200, body: { message: "Sucessfull", events } });
};

const GetSpecificEvent = async (req: Request, res: Response) => {
  const id = EventIdValidator.parse(req.params.id);
  const client = await pool.connect();
  const result = await client.query(getEventDetails, [id]);
  const events: Array<Events> = result.rows;
  client.release();

  return res
    .status(200)
    .send({ status: 200, body: { message: "Sucessfull", events } });
};

const CreateEvent = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const eventData = req.body;
  const sql_arr = eventProperties.map((prop) => eventData[prop]);
  if (eventData.name) {
    await client.query(createEvent, sql_arr).then(() => {
      client.release();
    });

    return res
      .status(200)
      .json({ status: 200, body: { message: "Sucessfull" } });
  } else
    return res
      .status(400)
      .json({ status: 400, body: { message: "BadRequest" } });
};

const DeleteEvent = async (req: Request, res: Response) => {
  const id = EventIdValidator.parse(req.params.id);
  if (id) {
    const client = await pool.connect();
    await client.query(deleteEvent, [id]).then(() => {
      client.release();
    });
    return res
      .status(200)
      .json({ status: 200, body: { message: "Sucessfull" } });
  } else
    return res
      .status(400)
      .json({ status: 400, body: { message: "BadRequest" } });
};

const UpdateEvent = async (req: Request, res: Response) => {
  const id = EventIdValidator.parse(req.params.id);
  const client = await pool.connect();
  const eventData = { ...req.body };
  const sql_arr = eventProperties.map((props) => eventData[props]);
  if (id) {
    await client.query(updateEvent, [...sql_arr, id]);
    client.release();

    return res
      .status(200)
      .json({ status: 200, body: { message: "Sucessfull" } });
  } else
    return res
      .status(400)
      .json({ status: 400, body: { message: "BadRequest" } });
};

export {
  CreateEvent,
  DeleteEvent,
  GetAllEvents,
  GetSpecificEvent,
  UpdateEvent,
};
