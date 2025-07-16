"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/app/_context/cartContext";
import PaymentInfo from "./PaymentInfo";

export default function CartTab() {
  const { cart, updateQuantity, removeFromCart } = useCart();

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
  const shipping = cart.length > 0 ? 0.99 : 0;
  const grandTotal = total + shipping;

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4">

      <h2 className="text-lg font-semibold">My cart</h2>


      {cart.length === 0 ? (
        <>
          <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center text-center px-4 py-10">
            <Image
              src="/empty-cart.png"
              alt="Empty Cart"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="font-semibold text-base">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-1">
              Hungry? 🍔 Add some delicious dishes to your cart and satisfy your cravings!
            </p>
          </div>



        </>
      ) : (
        <>

          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.foodId} className="flex items-start gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.foodId)}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
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
                  </div>
                </div>
              </li>
            ))}
          </ul>


          <PaymentInfo
            total={grandTotal}
            disabled={false}
            onCheckout={() => console.log("Checkout from CartTab")}
          />
        </>
      )}
    </div>
  );
}
