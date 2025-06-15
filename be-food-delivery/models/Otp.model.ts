import mongoose from "mongoose";

// ✅ Schema тодорхойлох
const OtpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Модель экспортлох (collection name → "otps")
export const OtpModel = mongoose.model("Otp", OtpSchema, "otps");

// ✅ Нарийн төрөл (populate хийсэн үед ашиглах)
export interface OtpTypePopulated extends mongoose.Document {
  code: string;
  expiresAt: Date;
  user: {
    _id: mongoose.Types.ObjectId;
    email: string;
    createdAt: Date;
  };
  email: string;
  createdAt: Date;
}
