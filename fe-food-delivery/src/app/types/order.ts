
export type OrderItem = {
  food: {
    foodName: string;
    image: string;
  };
  quantity: number;
};

export type Order = {
  _id: string;
  user?: {
    email: string;
  };
  deliveryAddress: string;
  totalPrice: number;
  status: "PENDING" | "CANCELED" | "DELIVERED";
  foodOrderItems: OrderItem[];
  createdAt: string;
};
