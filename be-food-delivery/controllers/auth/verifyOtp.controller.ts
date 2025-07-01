import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/User.model";
import { OtpModel, OtpTypePopulated } from "../../models/Otp.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-jwt-secret";

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email болон OTP хоёулаа шаардлагатай." });
    }

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

    if (!otpEntry) {
      return res.status(400).json({ message: "OTP буруу байна." });
    }

    if (otpEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP хугацаа дууссан байна." });
    }

    await OtpModel.deleteOne({ _id: otpEntry._id });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: "10m",
    });

    return res.json({
      message: "OTP verified",
      token,
      user: {
        id: otpEntry.user._id,
        email: otpEntry.user.email,
        createdAt: otpEntry.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};