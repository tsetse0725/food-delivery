"use client";

interface Props {
  total: number;
  disabled?: boolean;
  onCheckout?: () => void;
}

export default function PaymentInfo({
  total,
  disabled = true,
  onCheckout,
}: Props) {
  const shipping = total > 0 ? 0.99 : 0;
  const grandTotal = total + shipping;

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4">
      {/* ── Title ── */}
      <h2 className="text-lg font-semibold">Payment info</h2>

      {/* ── Price breakdown ── */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Items</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <hr className="border-dashed border-gray-300" />

        <div className="flex justify-between font-medium text-black">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ── Checkout button ── */}
      <button
        disabled={disabled}
        onClick={onCheckout}
        className={`w-full py-3 rounded-full text-white font-medium text-sm transition ${
          disabled
            ? "bg-red-100 text-white cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Checkout
      </button>
    </div>
  );
}
