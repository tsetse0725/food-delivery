import { Request, Response } from "express";
import { UserModel } from "../../models/User.model";
import { OtpModel } from "../../models/Otp.model";
import { transporter } from "../../utils/transporter";
import { generateOTP } from "../../utils/generateOtp";

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.deleteMany({ email: trimmedEmail });

    await OtpModel.create({
      code,
      expiresAt,
      user: user._id,
      email: trimmedEmail,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      html: `
        <div style="text-align: center;">
          <h2>One-Time Password</h2>
          <p>Use the following code to reset your password:</p>
          <h1 style="letter-spacing: 6px">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot-password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};