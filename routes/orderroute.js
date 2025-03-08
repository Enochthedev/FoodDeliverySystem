import express from "express";

import {
  placeorder,
  verifyorder,
  userorder,
  updatestatus,
  listorder,
  getAvailableOrders,
  commitOrder,
  getOrderCourier
} from "../controllers/ordercontroller.js";
import authmiddleware from "../middleware/auth.js";

const orderrouter = express.Router();

/**
 * @swagger
 * /api/orders/place:
 *   post:
 *     summary: Place an order
 *     description: Allows users to place an order and initiate payment.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a1"
 *               cartId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a2"
 *               address:
 *                 type: object
 *                 example: { street: "123 Main St", city: "Lagos", country: "Nigeria" }
 *               subtotal:
 *                 type: number
 *                 example: 50.00
 *               deliveryFee:
 *                 type: number
 *                 example: 5.00
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request
 */
orderrouter.post("/place", authmiddleware, placeorder);
/**
 * @swagger
 * /api/orders/verify:
 *   post:
 *     summary: Verify order payment
 *     description: Verifies payment for an order using Flutterwave.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderid:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a3"
 *               success:
 *                 type: boolean
 *                 example: true
 *               transaction_id:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 */
orderrouter.post("/verify", verifyorder);
/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get user orders
 *     description: Fetch all orders made by the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
orderrouter.get("/user", authmiddleware, userorder);
/**
 * @swagger
 * /api/orders/list:
 *   get:
 *     summary: Get all orders (Admin)
 *     description: Fetch all orders in the system (Admin only).
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
orderrouter.get("/list", listorder);
/**
 * @swagger
 * /api/orders/status:
 *   put:
 *     summary: Update order status
 *     description: Allows admin or relevant personnel to update an order's status.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a4"
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Food Processing", "Out for Delivery", "Delivered", "Cancelled"]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
orderrouter.put("/status", authmiddleware, updatestatus);

/**
 * @swagger
 * /api/orders/available:
 *   get:
 *     summary: Get available orders for couriers
 *     description: Fetches all unassigned orders that couriers can commit to.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Available orders retrieved successfully
 */
orderrouter.get("/available", authmiddleware, getAvailableOrders);

/**
 * @swagger
 * /api/orders/commit:
 *   post:
 *     summary: Commit to an order as a courier
 *     description: Allows a courier to claim an available order.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a5"
 *               courierId:
 *                 type: string
 *                 example: "65f2b1e9e2d2a4f1d89a23a6"
 *     responses:
 *       200:
 *         description: Order committed successfully
 */
orderrouter.post("/commit", authmiddleware, commitOrder);

/**
 * @swagger
 * /api/orders/{orderId}/courier:
 *   get:
 *     summary: Get the assigned courier for an order
 *     description: Fetches details of the courier assigned to a specific order.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f2b1e9e2d2a4f1d89a23a7"
 *     responses:
 *       200:
 *         description: Courier details retrieved successfully
 */
orderrouter.get("/:orderId/courier", authmiddleware, getOrderCourier);

export default orderrouter;
