// models/User.model.ts

import mongoose from "mongoose";

// 📦 Schema definition
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 🕓 createdAt, updatedAt автоматаар нэмэгдэнэ
  }
);

// 🚀 Model definition
export const UserModel = mongoose.model("User", UserSchema);
