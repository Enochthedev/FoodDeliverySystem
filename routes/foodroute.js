import express from "express";
import {
  addfood,
  listfood,
  removefood,
} from "../controllers/foodcontrollers.js";

import multer from "multer";

const foodrouter = express.Router();

// image strogers
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodrouter.post("/add", upload.single("image"), addfood);
foodrouter.get("/list", listfood);
foodrouter.delete("/remove", removefood);

export default foodrouter;
