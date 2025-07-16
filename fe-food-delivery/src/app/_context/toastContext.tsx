"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");
  const [visible, setVisible] = useState(false);

  const showToast = (msg: string, toastType: ToastType = "success") => {
    setMessage(msg);
    setType(toastType);

    // ✅ Дараалсан toast-уудыг зөв дарааллаар харуулах
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000); // 3 секунд харуулна
    }, 50); // 50ms хүлээгээд дараагийнхийг trigger хийж байна
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      {visible && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white transition-all duration-300 z-50 ${
            type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
