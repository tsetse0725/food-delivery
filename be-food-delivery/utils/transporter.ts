// utils/transporter.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // 🔐 .env-ээс авна
    pass: process.env.EMAIL_PASS, // 🔐 App password
  },
});
