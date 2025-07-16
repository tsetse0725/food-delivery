
import { api } from "./lib.api";

export const createOrder = async ({
  userId,
  items,
  deliveryAddress,
}: {
  userId: string;
  items: { foodId: string; quantity: number }[];
  deliveryAddress: string;
}) => {
  const response = await api.post("/orders", {
    userId,
    items,
    deliveryAddress,
  });

  return response.data; 
};
