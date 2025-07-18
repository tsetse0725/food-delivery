import mongoose, { Schema, Types, Document } from "mongoose";

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

const FoodSchema = new Schema<FoodType>(
  {
    foodName: { type: String, required: true, unique: true }, 
    price: { type: Number, required: true },
    image: { type: String, required: true },
    ingredients: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "FoodCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export const FoodModel = mongoose.model<FoodType>("Food", FoodSchema, "foods");
