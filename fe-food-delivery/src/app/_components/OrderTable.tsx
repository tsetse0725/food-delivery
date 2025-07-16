"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/lib.api";
import type { Order } from "@/app/types/order";
import ChangeStatusModal from "./ChangeStatusModal"; // 🆕 Import modal component

type Props = {
  orders: Order[];
};

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELED", label: "Canceled" },
];

export default function OrderTable({ orders }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [filterRange, setFilterRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const itemsPerPage = 5;

  const filteredOrders = filterRange
    ? orders.filter((order) => {
        const date = new Date(order.createdAt);
        const from = new Date(filterRange[0]);
        const to = new Date(filterRange[1]);
        return date >= from && date <= to;
      })
    : orders;

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (
    newStatus: Order["status"],
    id?: string
  ) => {
    const targetIds = id ? [id] : selected;
    try {
      await Promise.all(
        targetIds.map((orderId) =>
          api.patch(`/orders/${orderId}`, { status: newStatus })
        )
      );
      window.location.reload();
    } catch (err) {
      console.error("Статус солих үед алдаа гарлаа:", err);
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-sm text-gray-500">{orders.length} items</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            onChange={(e) =>
              setFilterRange((prev) => [e.target.value, prev?.[1] || ""])
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            onChange={(e) =>
              setFilterRange((prev) => [prev?.[0] || "", e.target.value])
            }
            className="border p-2 rounded"
          />
          <button
            disabled={!selected.length}
            onClick={() => setOpenModal(true)}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Change delivery state
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                checked={selected.length === orders.length}
                onChange={(e) =>
                  setSelected(e.target.checked ? orders.map((o) => o._id) : [])
                }
              />
            </th>
            <th className="p-2">№</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Food</th>
            <th className="p-2">Date</th>
            <th className="p-2">Total</th>
            <th className="p-2">Address</th>
            <th className="p-2">Delivery State</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, index) => (
            <tr key={order._id} className="border-t">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selected.includes(order._id)}
                  onChange={() => toggleSelect(order._id)}
                />
              </td>
              <td className="p-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="p-2">{order.user?.email || "N/A"}</td>
              <td className="p-2">
                {order.foodOrderItems.length} food
                <div className="text-xs text-gray-500">
                  {order.foodOrderItems
                    .map((item) => `${item.food.foodName} x${item.quantity}`)
                    .join(", ")}
                </div>
              </td>
              <td className="p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">${order.totalPrice.toFixed(2)}</td>
              <td className="p-2">{order.deliveryAddress}</td>
              <td className="p-2">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as Order["status"], order._id)
                  }
                  className={`text-xs px-2 py-1 border rounded-full ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-2 pt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-black text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ChangeStatusModal */}
      <ChangeStatusModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedIds={selected}
        onSubmit={handleStatusChange}
      />
    </div>
  );
}