"use client";

import Image from "next/image";
import { useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/_context/cartContext";
import CartTab from "./CartTab";
import OrderTab from "./OrderTab";
import PaymentInfo from "./PaymentInfo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/_components/UserProvider";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import SuccessOrderModal from "./SuccessOrderModal";
import { createOrder } from "@/lib/order.api";
import { useToast } from "@/app/_context/toastContext";

interface Props {
  onClose: () => void;
}

const schema = z.object({
  location: z.string().min(1, "Delivery location is required"),
});

type FormData = z.infer<typeof schema>;

export default function CartSidebar({ onClose }: Props) {
  const [tab, setTab] = useState<"cart" | "order">("cart");
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleQtyChange = (foodId: string, delta: number) => {
    const item = cart.find((item) => item.foodId === foodId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(foodId);
    } else {
      updateQuantity(foodId, newQty);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }

    try {
      await createOrder({
        userId: user.userId,
        deliveryAddress: data.location,
        items: cart.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setShowSuccess(true);
    } catch (err) {
      console.error("Захиалга илгээхэд алдаа гарлаа:", err);
      showToast("Захиалга илгээхэд алдаа гарлаа");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full p-6 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Order detail</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-gray-200 rounded-full p-1 mb-6">
          <button
            onClick={() => setTab("cart")}
            className={`flex-1 text-sm font-medium py-2 rounded-full ${
              tab === "cart" ? "bg-red-500 text-white" : "text-gray-700"
            }`}
          >
            Cart
          </button>
          <button
            onClick={() => setTab("order")}
            className={`flex-1 text-sm font-medium py-2 rounded-full ${
              tab === "order" ? "bg-red-500 text-white" : "text-gray-700"
            }`}
          >
            Order
          </button>
        </div>

        {tab === "cart" && (
          <>
            <h3 className="text-base font-semibold mb-4">My cart</h3>

            {cart.length === 0 ? (
              <CartTab />
            ) : (
              <>
                <ul className="space-y-6 mb-6">
                  {cart.map((item) => (
                    <li key={item.foodId} className="border-b pb-4">
                      <div className="flex gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-sm text-red-600">
                                {item.name}
                              </h4>
                              {item.ingredients && (
                                <p className="text-xs text-gray-500">
                                  {item.ingredients.join(", ")}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.foodId)}
                              className="border border-red-400 text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQtyChange(item.foodId, -1)}
                              className="px-2 py-1 border rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(item.foodId, 1)}
                              className="px-2 py-1 border rounded"
                            >
                              <Plus size={14} />
                            </button>
                            <span className="ml-auto font-semibold text-sm">
                              ${Number(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter delivery location"
                    {...register("location")}
                    className="w-full px-4 py-2 border rounded"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location.message}</p>
                  )}

                  <PaymentInfo
                    total={total}
                    disabled={cart.length === 0}
                    onCheckout={() => {}}
                  />
                </form>
              </>
            )}
          </>
        )}

        {tab === "order" && <OrderTab />}
      </div>

      {showLoginAlert && (
        <Dialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-[320px] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">You need to log in first</h3>
                <button onClick={() => setShowLoginAlert(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowLoginAlert(false);
                    router.push("/login");
                  }}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setShowLoginAlert(false);
                    router.push("/signup");
                  }}
                  className="bg-gray-100 text-black px-4 py-2 rounded"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      <SuccessOrderModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}