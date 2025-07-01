import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyTokenController = (req: Request, res: Response) => {
  const { token } = req.body;

  console.log("🧪 [VERIFY] Token from req.body:", token);
  console.log("🔐 JWT_SECRET (first 5 chars):", JWT_SECRET.slice(0, 5), "...");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      email?: string;
    };

    console.log("✅ Decoded token:", decoded);

    if (!decoded || !decoded.userId || !decoded.email) {
      console.warn("⚠️ Token missing userId or email");
      return res.status(401).json({ message: "Invalid token structure" });
    }

    // ✅ userId ба email хоёулаа дамжуулна
    res.json({
      destructToken: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error: any) {
    console.error("❌ Token verify error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
