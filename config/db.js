import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connecDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL).then(() => {
      console.log("DB Connected");
    });
  } catch (error) {
    console.log("Error: DB Not Connented");
  }
};
