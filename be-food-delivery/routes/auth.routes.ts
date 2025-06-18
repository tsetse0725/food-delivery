import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.model";
import { OtpModel, OtpTypePopulated } from "../models/Otp.model";
import { transporter } from "../utils/transporter";
import { generateOTP } from "../utils/generateOtp";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-default-jwt-secret";

router.get("/", (req: Request, res: Response) => {
  res.send(" Food Delivery API is running");
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({ email: trimmedEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({ email: trimmedEmail, password: hashed });

    res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.error(" Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.create({
      code,
      expiresAt,
      user: user._id,
      email: trimmedEmail,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: " Your OTP Code",
      encoding: "base64",
      html: `
        <div style="text-align: center;">
          <h2> One-Time Password</h2>
          <p>Use the following code to reset your password:</p>
          <h1 style="letter-spacing: 6px">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(" Forgot-password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otpEntry = await OtpModel.findOne({
      code: String(code),
      user: user._id,
      email: trimmedEmail,
    })
      .populate("user")
      .lean<OtpTypePopulated>();

    if (!otpEntry) return res.status(400).json({ message: "Invalid OTP" });
    if (otpEntry.expiresAt < new Date())
      return res.status(400).json({ message: "Expired OTP" });

    await OtpModel.deleteOne({ _id: otpEntry._id });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "10m",
    });

    res.json({
      message: "OTP verified",
      token,
      user: {
        id: otpEntry.user._id,
        email: otpEntry.user.email,
        createdAt: otpEntry.user.createdAt,
      },
    });
  } catch (error) {
    console.error(" Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.userId).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password must be different from old password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(" Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };

    console.log(" decoded in /verify:", decoded);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    res.json({ destructToken: decoded });
  } catch (error) {
    console.error(" Token verify error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
