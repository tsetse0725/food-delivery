
import mongoose, { Document, Schema, Types } from "mongoose";

export interface UserType extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  role: "USER" | "ADMIN";
  orderedFoods: Types.ObjectId[];
  ttl?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserType>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    orderedFoods: [{ type: Schema.Types.ObjectId, ref: "FoodOrder" }],
    ttl: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//  3. Model
export const UserModel = mongoose.model<UserType>("User", UserSchema, "users");
