/**
 * Fetch all orders (Admin access)
 */
const listorder = async (req, res) => {
  try {
    const orders = await ordermodel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};
import ordermodel from "../models/ordermodel.js";
import usermodel from "../models/userModel.js";

let flw;
if (process.env.FLW_PUBLIC_KEY && process.env.FLW_SECRET_KEY) {
  import("flutterwave-node-v3").then(module => {
    flw = new module.default(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
  }).catch(err => {
    console.error("Failed to load Flutterwave SDK:", err);
  });
}

/**
 * Place an order and initiate payment via Flutterwave or Demo Mode
 */
const placeorder = async (req, res) => {
  const frontend_url = "http://localhost:3000";
  try {
    const subtotal = req.body.subtotal; 
    const deliveryFee = req.body.deliveryFee || 2;
    const serviceFee = subtotal * 0.15;
    const totalAmount = subtotal + serviceFee + deliveryFee;

    const neworder = new ordermodel({
      userId: req.body.userId,
      cartId: req.body.cartId,
      address: req.body.address,
      subtotal,
      serviceFee,
      deliveryFee,
      totalAmount,
    });

    await neworder.save();
    await usermodel.findByIdAndUpdate(req.body.userId, { cartdata: {} });

    if (!flw) {
      console.warn("Flutterwave keys are missing. Running in demo mode.");
      return res.json({
        success: true,
        message: "Demo mode: Payment simulated",
        orderId: neworder._id,
        payment_url: `${frontend_url}/demo-payment?orderid=${neworder._id}`,
      });
    }

    const transaction = await flw.PaymentInitiate({
      tx_ref: `order-${neworder._id}`,
      amount: totalAmount,
      currency: "USD",
      redirect_url: `${frontend_url}/verify?success=true&orderid=${neworder._id}`,
      customer: {
        email: req.body.email,
        name: req.body.name,
      },
    });

    if (transaction.status !== "success") {
      return res.json({ success: false, message: "Payment initiation failed" });
    }

    res.json({ success: true, payment_url: transaction.data.link, orderId: neworder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error processing order" });
  }
};

/**
 * Verify payment from Flutterwave or Demo Mode
 */
const verifyorder = async (req, res) => {
  const { orderid, success, transaction_id } = req.body;
  try {
    if (success !== "true") {
      await ordermodel.findByIdAndDelete(orderid);
      return res.json({ success: false, message: "Payment failed" });
    }

    if (!flw) {
      console.warn("Flutterwave keys are missing. Running in demo mode.");
      await ordermodel.findByIdAndUpdate(orderid, { payment: true });
      return res.json({ success: true, message: "Demo mode: Payment verified" });
    }

    const response = await flw.TransactionVerify({ id: transaction_id });
    if (response.status === "success" && response.data.status === "successful") {
      await ordermodel.findByIdAndUpdate(orderid, { payment: true });
      return res.json({ success: true, message: "Payment verified" });
    }

    res.json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

/**
 * Fetch orders for a specific user, including courier details
 */
const userorder = async (req, res) => {
  try {
    const orders = await ordermodel
      .find({ userId: req.body.userId })
      .populate("courierId", "firstName lastName email"); 

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

/**
 * Get the assigned courier for an order
 */
const getOrderCourier = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await ordermodel.findById(orderId).populate("courierId", "firstName lastName email");

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (!order.courierId) {
      return res.json({ success: true, message: "No courier assigned yet", courier: null });
    }

    res.json({ success: true, courier: order.courierId });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching order courier details" });
  }
};

/**
 * Commit to an order as a courier
 */
const commitOrder = async (req, res) => {
  try {
    const { orderId, courierId } = req.body;

    const order = await ordermodel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.courierId) {
      return res.json({ success: false, message: "Order already assigned to a courier" });
    }

    order.courierId = courierId;
    order.status = "Out for Delivery";
    await order.save();

    res.json({ success: true, message: "Order committed successfully", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error committing to order" });
  }
};

/**
 * Get all available orders (Unassigned orders)
 */
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await ordermodel.find({ courierId: null });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching available orders" });
  }
};

/**
 * Get detailed delivery information for an order
 */
const getOrderDeliveryDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await ordermodel
      .findById(orderId)
      .populate("userId", "firstName lastName phoneNumber matricNumber") // Customer details
      .populate("courierId", "firstName lastName phoneNumber matricNumber") // Courier details
      .populate({
        path: "cartId",
        populate: {
          path: "restaurantId",
          select: "name address",
        },
      });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const deliveryDetails = {
      customer: {
        name: `${order.userId.firstName} ${order.userId.lastName}`,
        phone: order.userId.phoneNumber,
        matric: order.userId.matricNumber,
      },
      restaurant: {
        name: order.cartId.restaurantId?.name || "Unknown",
        address: order.cartId.restaurantId?.address || "Unknown",
      },
      deliveryAddress: order.address,
      courier: order.courierId
        ? {
            name: `${order.courierId.firstName} ${order.courierId.lastName}`,
            phone: order.courierId.phoneNumber,
            matric: order.courierId.matricNumber,
          }
        : null,
    };

    res.json({ success: true, data: deliveryDetails });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching delivery details" });
  }
};

/**
 * Update order status
 */
const updatestatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const validStatuses = ["Pending", "Food Processing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    const order = await ordermodel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order status" });
  }
};

export { placeorder, verifyorder, userorder, getOrderCourier, commitOrder, getAvailableOrders, getOrderDeliveryDetails, listorder, updatestatus };
