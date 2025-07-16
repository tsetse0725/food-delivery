import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/User.model";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: trimmedEmail });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // ✅ JWT-д: userId, email, role, isVerified бүгдийг оруулж өгнө
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,                // ✅ нэмж оруулсан
        isVerified: user.isVerified,    // ✅ нэмж оруулсан
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🟢 Амжилттай login
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
