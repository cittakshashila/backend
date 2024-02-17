import express from "express";
import { Module } from "../../libs/utils/types/module.js";
import {Paid, Registered,Emergency } from "../controllers/sesController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/support";

router.post("/registered", asyncMiddleware(Registered));
router.post("/paid", asyncMiddleware(Paid));
router.post("/emergency", asyncMiddleware(Emergency));

const MODULE: Module = {
  router,
  BASE_ROUTE,
};
export default MODULE;
