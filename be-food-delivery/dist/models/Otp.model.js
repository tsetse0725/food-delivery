// models/Otp.model.ts

import mongoose from "mongoose";

// ⏱️ OTP schema
const OtpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🟢 User model-тай холбоотой
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // 🕓 createdAt, updatedAt автоматаар хадгалагдана
});

// 🚀 Export model
export const OtpModel = mongoose.model("Otp", OtpSchema);
