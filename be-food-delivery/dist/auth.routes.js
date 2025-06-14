// auth.routes.ts

import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./models/User.model";
import { OtpModel } from "./models/Otp.model";
import { transporter } from "./utils/transporter";
import { generateOTP } from "./utils/generateOtp";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Health check
router.get("/", (req, res) => {
  res.send("🚀 Food Delivery API is running");
});

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const existing = await UserModel.findOne({ email: trimmedEmail });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ email: trimmedEmail, password: hashed });

    res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Logged in", token });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ FORGOT PASSWORD — ⛳️ ЭНД `user._id` гэж хадгална!
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 мин

    await OtpModel.create({
      code,
      expiresAt,
      user: user._id, // ✅ ЗААВАЛ user._id!
      email: trimmedEmail,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP</h3><p>${code}</p><p>This code expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ Forgot-password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ VERIFY OTP — ⛳️ ЭНД `user: user._id` гэж шалгана!
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otpEntry = await OtpModel.findOne({
      code: String(code),
      user: user._id, // ✅ ObjectId-гээр тааруулж байна
      email: trimmedEmail,
    }).populate("user");

    if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });
    if (otpEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });

    await OtpModel.deleteOne({ _id: otpEntry._id });

    res.json({ message: "OTP verified", token });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(decoded.userId, {
      password: hashed,
      updatedAt: new Date(),
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// ✅ VERIFY TOKEN
router.post("/verify", (req, res) => {
  try {
    const { token } = req.body;
    const destructToken = jwt.verify(token, JWT_SECRET);
    res.json({ destructToken });
  } catch (error) {
    console.error("❌ Verify token error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
});

export default router;
