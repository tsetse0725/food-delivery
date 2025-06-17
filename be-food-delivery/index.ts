import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import foodRoutes from "./routes/food.routes";
import categoryRoutes from "./routes/category.routes";

// 🔐 ENV config
dotenv.config();
const app = express();

// 🟢 App-level middleware
app.use(express.json());
app.use(cors());

// 🧪 Log: Start
console.log("✅ STARTING index.ts");

// 🔗 Routes бүртгэх
app.use(authRoutes);
app.use(foodRoutes);
app.use("/", categoryRoutes); // ✅ энэ мөрийг бүртгэх лог дагалдуулна

console.log("✅ Routes бүртгэл дууслаа");

const PORT = 8000;
const MONGO_URI = process.env.MONGO_URI || "";

// ⛓ DB connection
mongoose.connect(MONGO_URI);

// 🔌 DB нээгдэх үед
mongoose.connection.once("open", () => {
  const dbName = mongoose.connection.db?.databaseName || "(unknown)";
  console.log("✅ DB connected");
  console.log("📦 Used DB:", dbName);

  // 🚀 Server start
  app.listen(PORT, () => {
    console.log("🚀 Server on http://localhost:" + PORT);

    // 🧾 Route path-уудыг list хийх (дэлгэрэнгүй log)
    app._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        console.log("📌 Registered Route:", r.route.path);
      }
    });
  });
});

// ❌ DB алдаа барих
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
