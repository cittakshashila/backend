import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import {
  UpdatePaid,
  VerifyPaid,
  UserSignUp,
  UserLogIn,
  EventLogin,
  GetUsersFromEvent,
  UpdateUserCart,
  CreateEvent,
  EventAdminSignUp
} from "../controllers/adminController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import {
  CreateAdminToken,
  AuthourizeAdmin,
  CreateEventAdminToken,
} from "../middlewares/authHandler.js";

const router = express.Router();
const BASE_ROUTE = "/admin";

router.put("/pay-event", AuthourizeAdmin, asyncMiddleware(UpdatePaid));
router.put("/update-cart", AuthourizeAdmin, asyncMiddleware(UpdateUserCart));

router.put("/allow", AuthourizeAdmin, asyncMiddleware(VerifyPaid));
router.get("/get-users", AuthourizeAdmin, asyncMiddleware(GetUsersFromEvent));

//Comment this while PRODUCTION
router.post("/signup", asyncMiddleware(UserSignUp));
router.post("/event/signup", asyncMiddleware(EventAdminSignUp));
router.post("/create-event", asyncMiddleware(CreateEvent))

router.post("/login", asyncMiddleware(UserLogIn), CreateAdminToken);
router.post("/event/login", asyncMiddleware(EventLogin), CreateEventAdminToken);

const MODULE: Module = {
  router,
  BASE_ROUTE,
};
export default MODULE;
