// models/Food.model.ts
import mongoose, { Schema, Types, Document } from "mongoose";

// 1️⃣ Interface
export interface FoodType extends Document {
  _id: Types.ObjectId;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Schema
const FoodSchema = new Schema<FoodType>(
  {
    foodName: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Cloudinary image URL хадгалагдана
    ingredients: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "FoodCategory",
      required: true,
    },
  },
  { timestamps: true }
);

// 3️⃣ Model
export const FoodModel = mongoose.model<FoodType>(
  "Food",
  FoodSchema,
  "foods"
);
