import mongoose from "mongoose";

const foodschema = new mongoose.Schema({
  name: { type: "string", required: true },
  description: { type: "string", required: true },
  price: { type: "number", required: true },
  image: { type: "string", required: true },
  category: { type: "string", required: true },
});

const foodmodel = mongoose.models.food || mongoose.model("food", foodschema);

export default foodmodel;
