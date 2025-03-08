import express from "express";
import { addtocart, getcart, removecart } from "../controllers/cartcontroller.js";
import authmiddleware from "../middleware/auth.js";

const cartroute = express.Router();

cartroute.post("/addtocart", authmiddleware, addtocart);
cartroute.post("/removecart", authmiddleware, removecart);
cartroute.post("/getcart", authmiddleware, getcart);

export default cartroute;
