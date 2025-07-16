"use client";

import { useState } from "react";
import { api } from "@/lib/lib.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddCategoryForm() {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Нэрээ оруулна уу");
      return;
    }

    try {
      setLoading(true);
      await api.post("/categories", { categoryName });
      window.location.reload(); 
    } catch (err: any) {
      setError(err?.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center bg-white p-4 border rounded"
    >
      <Input
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Шинэ category нэр"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Нэмэгдэж байна..." : "Нэмэх"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
