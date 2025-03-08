import ordermodel from "../models/ordermodel.js";
import Stripe from "stripe";
import usermodel from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY);

const placeorder = async (req, res) => {
  const fontend_url = "http://localhost:3000";
  try {
    const neworder = new ordermodel({
      userid: req.body.userid,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await neworder.save();
    await usermodel.findByIdAndUpdate(req.body.userid, { cartdata: {} });
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Changes",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${fontend_url}/verify?success=true&orderid=${neworder._id}`,
      cancel_url: `${fontend_url}/verify?success=false&orderid=${neworder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

const verifyorder = async (req, res) => {
  const { orderid, success } = req.body;
  try {
    if (success == "true") {
      await ordermodel.findByIdAndUpdate(orderid, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await ordermodel.findByIdAndDelete(orderid);
      res.json({ success: false, message: "No" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const userorder = async (req, res) => {
  try {
    const orders = await ordermodel.find({ userid: req.body.userid });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const listorder = async (req, res) => {
  try {
    const orders = await ordermodel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const updatestatus = async (req, res) => {
  try {
    await ordermodel.findByIdAndUpdate(req.body.orderid, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Update" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { updatestatus, listorder, placeorder, verifyorder, userorder };
