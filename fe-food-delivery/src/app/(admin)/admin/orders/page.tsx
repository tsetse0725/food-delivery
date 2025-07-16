"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/lib.api";
import OrderTable from "@/app/_components/OrderTable";
import type { Order } from "@/app/types/order";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/orders"); 
        setOrders(res.data);
      } catch (error) {
        console.error("Захиалга татах үед алдаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Admin - Захиалгын жагсаалт</h1>
      {loading ? (
        <p>Түр хүлээнэ үү...</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
