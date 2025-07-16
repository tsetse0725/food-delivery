import mongoose, { Schema, Document, Types, model } from "mongoose";

/* ─────────────────────────────────────────────── */
/* 🧩 Захиалсан нэг хоолны төрөл                 */
/* ─────────────────────────────────────────────── */
export interface FoodOrderItemType {
  food: Types.ObjectId;   // 🟡 Food-ийн ID
  quantity: number;       // 🟡 Тоо ширхэг
}

/* ─────────────────────────────────────────────── */
/* 📦 Захиалгын гол Document төрөл               */
/* ─────────────────────────────────────────────── */
export interface FoodOrderType extends Document {
  user: Types.ObjectId;                        // 👤 Хэрэглэгч ID
  totalPrice: number;                          // 💰 Нийт үнэ
  deliveryAddress: string;                     // 🏠 Хаяг
  foodOrderItems: FoodOrderItemType[];         // 🍽️ Захиалсан хоолнууд
  status: "PENDING" | "CANCELED" | "DELIVERED"; // 🚚 Хүргэлтийн төлөв
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────────────────────────── */
/* 🍽️ Дотоод нэг хоолны subdocument schema      */
/* ─────────────────────────────────────────────── */
const FoodOrderItemSchema = new Schema<FoodOrderItemType>(
  {
    food: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
  },
  { _id: false } // ➕ subdocument учраас тусдаа _id үүсгэхгүй
);

/* ─────────────────────────────────────────────── */
/* 📦 Захиалгын ерөнхий schema                   */
/* ─────────────────────────────────────────────── */
const FoodOrderSchema = new Schema<FoodOrderType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price must be positive"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
    },
    foodOrderItems: {
      type: [FoodOrderItemSchema],
      validate: [(val: any[]) => val.length > 0, "At least one food item is required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELED", "DELIVERED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар үүснэ
    versionKey: false, // __v талбарыг арилгана
  }
);

/* ─────────────────────────────────────────────── */
/* ✅ Model export                                */
/* ─────────────────────────────────────────────── */
export const FoodOrderModel = model<FoodOrderType>(
  "FoodOrder",       // 🔑 Model name
  FoodOrderSchema,   // 📄 Schema
  "foodorders"       // 📦 MongoDB collection name
);
