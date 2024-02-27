import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import {Paid, Registered,Emergency,Sendotp } from "../controllers/sesController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import {AuthourizeAdmin, AuthourizeUser} from "../middlewares/authHandler.js";

const router = express.Router();
const BASE_ROUTE = "/support";

router.post("/registered", AuthourizeUser, asyncMiddleware(Registered));
router.post("/sendotp", AuthourizeUser, asyncMiddleware(Sendotp));

router.post("/paid", AuthourizeAdmin, asyncMiddleware(Paid));
router.post("/emergency", AuthourizeAdmin, asyncMiddleware(Emergency));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};
export default MODULE;
