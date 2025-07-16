import mongoose, { Schema, Types, Document } from "mongoose";

export interface FoodCategoryType extends Document {
  _id: Types.ObjectId;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodCategorySchema = new Schema<FoodCategoryType>(
  {
    categoryName: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const FoodCategoryModel = mongoose.model<FoodCategoryType>(
  "FoodCategory",            // model name
  FoodCategorySchema,
  "foodcategories"          // actual collection name in DB
);
