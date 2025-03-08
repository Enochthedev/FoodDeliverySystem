import express from "express";
import cors from "cors";
import { connecDB } from "./config/db.js";
import foodrouter from "./routes/foodroute.js";
import userroute from "./routes/userRoute.js";
import cartroute from "./routes/cartroute.js";
import orderrouter from "./routes/orderroute.js";
import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// app config
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/food", foodrouter);
app.use("/image", express.static("uploads"));
app.use("/api/user", userroute);
app.use("/api/cart", cartroute);
app.use("/api/order", orderrouter);

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Delivery System API",
      version: "1.0.0",
      description: "API documentation for the Food Delivery System",
    },
  },
  apis: ["./routes/*.js"], // Ensure this path is correct
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// DB Connection
connecDB();

// APIs
app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
  console.log(`Swagger API Docs available at http://localhost:${port}/api-docs`);
});
