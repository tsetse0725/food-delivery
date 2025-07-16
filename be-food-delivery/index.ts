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

console.log("🚀 STARTING index.ts");

app.use("/auth", authRoutes);
app.use("/foods", foodRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes); 

console.log(" Routes бүртгэл дууслаа");

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  const dbName = mongoose.connection.db?.databaseName || "(unknown)";
  console.log(" DB connected");
  console.log(" Used DB:", dbName);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);

    app._router?.stack?.forEach((r: any) => {
      if (r.route && r.route.path) {
        const methods = Object.keys(r.route.methods)
          .map((m) => m.toUpperCase())
          .join(", ");
        console.log(`➡️  ${methods} ${r.route.path}`);
      }
    });
  });
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err);
});
