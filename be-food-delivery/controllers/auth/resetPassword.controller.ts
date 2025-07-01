import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/User.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-jwt-secret";

export const resetPasswordController = async (req: Request, res: Response) => {
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
    console.error("Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};