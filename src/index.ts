import express from "express";
import cors from "cors";
import { PORT } from "../config/port.js";
import { Admin, Events, Users, Support } from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import { AuthourizeAdmin, AuthourizeUser } from "./middlewares/authHandler.js";
import serverless from "serverless-http";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.cittakshashila.in/",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(Events.BASE_ROUTE, AuthourizeAdmin, Events.router);
app.use(Users.BASE_ROUTE, AuthourizeUser, Users.router);
app.use(Admin.BASE_ROUTE, Admin.router);
app.use(Support.BASE_ROUTE, Support.router);

app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`PORT RUNNING ON ${PORT}`);
// });

export const handler = serverless(app);
