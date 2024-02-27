import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import { CreateEvent, UpdateEvent } from "../controllers/eventController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/events";

router.post("/", asyncMiddleware(CreateEvent));
router.put("/", asyncMiddleware(UpdateEvent));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};

export default MODULE;
