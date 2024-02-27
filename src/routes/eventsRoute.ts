import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import { CreateEvent } from "../controllers/eventController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/events";

router.post("/", asyncMiddleware(CreateEvent));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};

export default MODULE;
