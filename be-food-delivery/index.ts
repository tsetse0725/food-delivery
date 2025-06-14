// index.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(authRoutes);

const PORT = 8000;
const MONGO_URI = process.env.MONGO_URI || "";

// ✅ DB connect
mongoose.connect(MONGO_URI);

// ✅ Once Mongo connection is fully open
mongoose.connection.once("open", () => {
  const dbName = mongoose.connection.db?.databaseName || "(unknown)";
  console.log("✅ DB connected");
  console.log("📦 Used DB:", dbName);

  app.listen(PORT, () => {
    console.log(`🚀 Server on http://localhost:${PORT}`);
  });
});

// ❌ Error listener
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
