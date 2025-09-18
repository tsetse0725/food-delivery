import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.routes";
import foodRoutes from "./routes/food.routes";
import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" MONGO_URI not found in .env");
  process.exit(1);
}


app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://food-delivery-pied-eta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

console.log("🚀 Starting Express server...");


app.use("/auth", authRoutes);
app.use("/foods", foodRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

console.log(" Routes registered");


app.listen(PORT, () => {
  console.log(` Server running at: http://localhost:${PORT}`);
});


mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  })
  .then(() => {
    const dbName = mongoose.connection.db?.databaseName || "(unknown)";
    console.log(` MongoDB connected: ${dbName}`);
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });


mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB runtime error:", err);
});
