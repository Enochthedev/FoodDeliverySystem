import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  courierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Initially no driver assigned
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Food Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  payment: {
    type: Boolean,
    default: false,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  serviceFee: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// **Pre-save Hook to Calculate Order Summary**
orderschema.pre("save", async function (next) {
  if (!this.isModified("subtotal")) return next();

  // Calculate Service Fee (15% of subtotal)
  this.serviceFee = this.subtotal * 0.15;

  // Ensure totalAmount includes all fees
  this.totalAmount = this.subtotal + this.serviceFee + this.deliveryFee;

  next();
});

const ordermodel = mongoose.model("Order", orderschema);

export default ordermodel;
