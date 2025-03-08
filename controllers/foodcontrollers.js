import foodmodel from "../models/foodmodel.js";
import fs from "fs";

// add food item
const addfood = async (req, res) => {
  // console.log(req.body);
  let image_fileanme = `${req.file.filename}`;
  // console.log(image_fileanme);

  const food = new foodmodel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_fileanme,
  });
  try {
    await food.save();
    res.json({ success: true, message: "food saved successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Request failed" });
  }
};

// get food list
const listfood = async (req, res) => {
  try {
    const food = await foodmodel.find({});
    res.json({ success: true, data: food });
  } catch (error) {
    res.json({ error: "Request failed" });
  }
};

// remove food item
const removefood = async (req, res) => {
  try {
    console.log(req.body.id);
    const food = await foodmodel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodmodel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "data deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: "error deleting" });
  }
};

export { addfood, listfood, removefood };
