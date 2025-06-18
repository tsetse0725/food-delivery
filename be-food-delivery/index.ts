import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import foodRoutes from "./routes/food.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

console.log(" STARTING index.ts");

app.use(authRoutes);
app.use(foodRoutes);
app.use("/", categoryRoutes);

console.log(" Routes бүртгэл дууслаа");

const PORT = 8000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  const dbName = mongoose.connection.db?.databaseName || "(unknown)";
  console.log(" DB connected");
  console.log(" Used DB:", dbName);

  app.listen(PORT, () => {
    console.log(" Server on http://localhost:" + PORT);

    app._router?.stack?.forEach((r: any) => {
      if (r.route && r.route.path) {
        console.log(" Registered Route:", r.route.path);
      }
    });
  });
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err);
});
