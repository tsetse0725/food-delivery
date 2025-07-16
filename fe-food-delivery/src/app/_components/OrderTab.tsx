"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";
import { api } from "@/lib/lib.api"; // axios instance

interface OrderItem {
  food: {
    foodName: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  totalPrice: number;
  deliveryAddress: string;
  status: string;
  foodOrderItems: OrderItem[];
  createdAt: string;
}

export default function OrderTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/user/${user.userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Захиалга татахад алдаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId]); // ✅ зөвхөн userId-г харах

  if (loading) {
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 space-y-4">
        <h2 className="text-lg font-semibold">Order history</h2>
        <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center text-center px-4 py-10">
          <Image
            src="/empty-cart.png"
            alt="No Orders"
            width={80}
            height={80}
            className="mb-4"
          />
          <h3 className="font-semibold text-base">No Orders Yet?</h3>
          <p className="text-sm text-gray-500 mt-1">
            🍕 You haven't placed any orders yet. Start exploring our menu and satisfy your cravings!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">Order history</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border p-4 rounded-xl shadow-sm space-y-3">
            <p className="text-sm text-gray-600">
              <strong>Address:</strong> {order.deliveryAddress}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> {order.status}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Items:</strong>
            </p>
            <ul className="pl-4 list-disc text-sm text-gray-700">
              {order.foodOrderItems.map((item, idx) => (
                <li key={idx}>
                  {item.food.foodName} × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600">
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
