import express from "express";
import { PORT } from "../config/port.js";
import {
    Admin,
    Events,
    Users
} from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import { AuthourizeUser } from "./middlewares/authHandler.js"

const app = express();

app.use(express.json());

// app.use(Events.BASE_ROUTE, Events.router);
app.use(Users.BASE_ROUTE, AuthourizeUser, Users.router);
app.use(Admin.BASE_ROUTE, Admin.router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PORT RUNNING ON ${PORT}`);
});
