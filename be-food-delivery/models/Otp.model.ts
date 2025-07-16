import mongoose from "mongoose";


const OtpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


export const OtpModel = mongoose.model("Otp", OtpSchema, "otps");


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
