import express from "express";
import {
  CreateUser,
  GetUserCart,
  GetUserDetails,
  UpdateUserCart,
} from "../controllers/userController.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

const router = express.Router();
const BASE_ROUTE = "/user";

router.get("/", asyncMiddleware(GetUserDetails));
router.post("/", asyncMiddleware(CreateUser));
router.get("/get-cart", asyncMiddleware(GetUserCart));
router.put("/update-cart", asyncMiddleware(UpdateUserCart));

const MODULE = {
  router,
  BASE_ROUTE,
};
export default MODULE;
