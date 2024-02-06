import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import {
  CreateEvent,
  DeleteEvent,
  GetAllEvents,
  GetSpecificEvent,
  UpdateEvent,
} from "../controllers/eventController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/events";

router.get("/", asyncMiddleware(GetAllEvents));
router.get("/:id", asyncMiddleware(GetSpecificEvent));
router.post("/", asyncMiddleware(CreateEvent));
router.delete("/:id", asyncMiddleware(DeleteEvent));
router.put("/:id", asyncMiddleware(UpdateEvent));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};

export default MODULE;
