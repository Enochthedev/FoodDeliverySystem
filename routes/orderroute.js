import express from "express";

import {
  listorder,
  placeorder,
  updatestatus,
  userorder,
  verifyorder,
} from "../controllers/ordercontroller.js";
import authmiddleware from "../middleware/auth.js";

const orderrouter = express.Router();

orderrouter.post("/place", authmiddleware, placeorder);
orderrouter.post("/verify", verifyorder);
orderrouter.post("/userorder", authmiddleware, userorder);
orderrouter.get("/list", listorder);
orderrouter.post("/status", updatestatus);

export default orderrouter;
