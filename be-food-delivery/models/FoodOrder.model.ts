// models/FoodOrder.model.ts
import mongoose, { Schema, Types, Document } from "mongoose";

// 1️⃣ Embedded subdocument type
export interface FoodOrderItemType {
  food: Types.ObjectId;
  quantity: number;
}

// 2️⃣ Main order document type
export interface FoodOrderType extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  totalPrice: number;
  foodOrderItems: FoodOrderItemType[];
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: Date;
  updatedAt: Date;
}

// 3️⃣ Embedded schema
const FoodOrderItemSchema = new Schema<FoodOrderItemType>(
  {
    food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

// 4️⃣ Main schema
const FoodOrderSchema = new Schema<FoodOrderType>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalPrice: { type: Number, required: true },
    foodOrderItems: {
      type: [FoodOrderItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "DELIVERED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// 5️⃣ Model
export const FoodOrderModel = mongoose.model<FoodOrderType>(
  "FoodOrder",
  FoodOrderSchema,
  "foodorders"
);
