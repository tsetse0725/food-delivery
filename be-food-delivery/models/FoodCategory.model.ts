// models/FoodCategory.model.ts
import mongoose, { Schema, Types, Document } from "mongoose";

// 1️⃣ Interface
export interface FoodCategoryType extends Document {
  _id: Types.ObjectId;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Schema
const FoodCategorySchema = new Schema<FoodCategoryType>(
  {
    categoryName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// 3️⃣ Model
export const FoodCategoryModel = mongoose.model<FoodCategoryType>(
  "FoodCategory",
  FoodCategorySchema,
  "foodcategories" // collection нэр
);
