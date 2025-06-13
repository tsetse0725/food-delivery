import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import { transporter } from "./nodeMailer";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;
const MONGO_URI =
  "mongodb+srv://tse9406:PcFZu9ZgVWibinOs@fooddelivery.hxrouha.mongodb.net/";
const JWT_SECRET = "foodDelivery";

mongoose.connect(MONGO_URI).then(() => console.log("✅ DB connected"));

/* ---------------- SCHEMAS ---------------- */
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model("Users", UserSchema, "users");

const OtpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  email: { type: String, required: true }, // ✅ Имэйл хадгалах
  createdAt: { type: Date, default: Date.now },
});
const OtpModel = mongoose.model("Otp", OtpSchema);

/* ---------------- HELPERS ---------------- */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ---------------- ROUTES ---------------- */

// ✅ Signup
app.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const trimmedEmail = email.toLowerCase().trim();

  const existing = await UserModel.findOne({ email: trimmedEmail });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await UserModel.create({ email: trimmedEmail, password: hashed });

  res.json({ message: "Successfully registered" });
});

// ✅ Login
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const trimmedEmail = email.toLowerCase().trim();

  const user = await UserModel.findOne({ email: trimmedEmail });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Logged in", token });
});

// ✅ Forgot-password
app.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  const trimmedEmail = email.toLowerCase().trim();

  const user = await UserModel.findOne({ email: trimmedEmail });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await OtpModel.create({ code, expiresAt, user: user._id, email: trimmedEmail });

  await transporter.sendMail({
    from: "tse9406@gmail.com",
    to: user.email,
    subject: "Your OTP Code",
    html: `<h3>Your OTP</h3><p>${code}</p><p>This code expires in 5 minutes.</p>`,
  });

  res.json({ message: "OTP sent to email" });
});

// ✅ Verify OTP
app.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const trimmedEmail = email.toLowerCase().trim();

  const user = await UserModel.findOne({ email: trimmedEmail });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const otpEntry = await OtpModel.findOne({
    code: String(code),
    user: user._id,
    email: trimmedEmail,
  });

  if (!otpEntry) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (otpEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Expired OTP" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "10m",
  });

  await OtpModel.deleteOne({ _id: otpEntry._id });

  res.json({ message: "OTP verified", token });
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
    });

    res.json({ message: "Password reset successfully" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// ✅ Token verify
app.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const destructToken = jwt.verify(token, JWT_SECRET);
    res.json({ destructToken });
  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));