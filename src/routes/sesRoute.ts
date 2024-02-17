import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import { SendTest, Registered } from "../controllers/sesController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/support";

router.post("/test", asyncMiddleware(SendTest));
router.post("/registered", asyncMiddleware(Registered));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};
export default MODULE;
