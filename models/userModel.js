import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', 
    default: null
  },
  roles: {
    type: [String],
    enum: ['user', 'admin', 'delivery'],
    default: ['user'],
  },
}, { timestamps: true });

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const usermodel = mongoose.model("User", userschema);
export default usermodel;
