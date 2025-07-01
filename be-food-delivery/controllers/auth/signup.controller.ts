import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/User.model";

export const signupController = async (req: Request, res: Response) => {
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
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};