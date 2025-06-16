import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.model";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ Email давхцаж байгаа эсэх шалгах
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Имэйл бүртгэлтэй байна" });
    }

    // ✅ Password хэшлэх
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Хэрэглэгч үүсгэх
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Хэрэглэгч амжилттай бүртгэгдлээ", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Серверийн алдаа", error });
  }
};
