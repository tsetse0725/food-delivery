import mongoose, { Schema, Document, Types, model } from "mongoose";


export interface FoodOrderItemType {
  food: Types.ObjectId;   
  quantity: number;       
}


export interface FoodOrderType extends Document {
  user: Types.ObjectId;                       
  totalPrice: number;                          
  deliveryAddress: string;                    
  foodOrderItems: FoodOrderItemType[];         
  status: "PENDING" | "CANCELED" | "DELIVERED"; 
  createdAt: Date;
  updatedAt: Date;
}


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
  { _id: false } 
);


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
    timestamps: true, 
    versionKey: false, 
  }
);


export const FoodOrderModel = model<FoodOrderType>(
  "FoodOrder",       
  FoodOrderSchema,  
  "foodorders"       
);
