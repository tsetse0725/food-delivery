"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";
import axios from "axios";

type Props = {
  onClose: () => void;
};

export default function EnterLocationModal({ onClose }: Props) {
  const { user, setUser } = useAuth();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  // 👉 хэрвээ context дээр address байсан бол анхнаасаа input-д үзүүлнэ
  useEffect(() => {
    if (user?.address) setAddress(user.address);
  }, [user]);

  const handleSave = async () => {
    if (!address.trim()) {
      setError("📍 Хаяг заавал оруулна уу.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🟡 PATCH API-д шинэ хаяг илгээх
      await axios.patch(`${API_BASE}/users/${user?.userId}`, { address });

      // 🔵 Context шинэчилнэ
      setUser((prev) => (prev ? { ...prev, address } : prev));

      // ✅ Modal хаах
      onClose();
    } catch (err) {
      setError("⚠️ Хаяг хадгалах үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">📍 Та өөрийн хаягийг оруулна уу</h2>

        <input
          type="text"
          placeholder="Жишээ: БЗД, 13-р хороолол..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Болих
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}
