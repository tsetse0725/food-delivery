"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ 1. Zod schema-г эндээ л шууд бичнэ
const schema = z.object({
  location: z.string().min(1, "Delivery location is required"),
});

type FormData = z.infer<typeof schema>;

export default function DeliveryLocation({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input
        type="text"
        placeholder="Enter your delivery location"
        {...register("location")}
        className="w-full px-4 py-2 rounded border"
      />
      {errors.location && (
        <p className="text-red-500 text-sm">{errors.location.message}</p>
      )}
      <button
        type="submit"
        className="bg-red-500 text-white w-full py-2 rounded-full mt-2"
      >
        Checkout
      </button>
    </form>
  );
}
