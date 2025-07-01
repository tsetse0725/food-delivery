import mongoose, { Schema, Document, Types } from "mongoose";

// 🧾 Захиалгын нэг хоолны төрөл
export interface FoodOrderItemType {
  food: Types.ObjectId;
  quantity: number;
}

// 🧾 Бүх захиалгын төрөл
export interface FoodOrderType extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  totalPrice: number;
  foodOrderItems: FoodOrderItemType[];
  status: "PENDING" | "CANCELED" | "DELIVERED";
  createdAt: Date;
  updatedAt: Date;
}

// 🧩 Дотоод хоол бүрийн schema
const FoodOrderItemSchema = new Schema<FoodOrderItemType>(
  {
    food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

// 📦 Нийт захиалгын schema
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

// ✅ Экспорт хийж байна
export const FoodOrderModel = mongoose.model<FoodOrderType>(
  "FoodOrder",
  FoodOrderSchema,
  "foodorders"
);
