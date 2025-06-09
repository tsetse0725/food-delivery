"use client";
import { useAuth } from "@/app/_components/UserProvider";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>⏳ Түр хүлээнэ үү...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      {user ? (
        <p>🟢 Нэвтэрсэн хэрэглэгчийн ID: <strong>{user.userId}</strong></p>
      ) : (
        <p>🔴 Та нэвтрээгүй байна.</p>
      )}
    </div>
  );
}
