import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import { transporter } from "./nodeMailer"; // nodemailer config

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;
const MONGO_URI = "mongodb+srv://tse9406:PcFZu9ZgVWibinOs@fooddelivery.hxrouha.mongodb.net/foodDelivery";
const JWT_SECRET = "foodDelivery";

mongoose.connect(MONGO_URI).then(() => console.log("✅ DB connected"));

// ✅ Schema
const Users = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: String,
  otpExpiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model("Users", Users);

// ✅ Signup
app.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(400).send({ message: "User already exists" });
  const hashed = await bcrypt.hash(password, 10);
  await UserModel.create({ email, password: hashed });
  res.send({ message: "Successfully registered" });
});

// ✅ Login
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).send({ message: "User doesn't exist" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send({ message: "Wrong password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.send({ message: "Logged in", token });
});

// ✅ Forgot-password
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(400).send({ message: "User not found" });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiresAt = expiresAt;
  await user.save();

  try {
    await transporter.sendMail({
      from: "tse9406@gmail.com",
      to: user.email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP</h3><p>${otp}</p><p>This code expires in 5 minutes.</p>`,
    });
    res.send({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send({ message: "Failed to send email" });
  }
});

// ✅ Verify OTP
app.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).send({ message: "Invalid or expired OTP" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });
  res.send({ message: "OTP verified", token });
});

// ✅ Reset password
app.post("/reset-password/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(decoded.userId, {
      password: hashed,
      updatedAt: new Date(),
      otp: null,
      otpExpiresAt: null,
    });
    res.send({ message: "Password reset successfully" });
  } catch {
    res.status(400).send({ message: "Invalid or expired token" });
  }
});

// ✅ Token verify
app.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const destructToken = jwt.verify(token, JWT_SECRET);
    res.send({ destructToken });
  } catch {
    res.status(400).send({ message: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
