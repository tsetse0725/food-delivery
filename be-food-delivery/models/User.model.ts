import mongoose, { Document, Schema, Types } from "mongoose";

// ✅ Schema тодорхойлсон хэсэг
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ Модель экспортлох
export const UserModel = mongoose.model("Users", UserSchema, "users");

// ✅ Type тодорхойлсон хэсэг
export interface UserType extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
