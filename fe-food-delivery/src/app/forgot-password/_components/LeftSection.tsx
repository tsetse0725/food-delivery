"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LeftSection() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Имэйл формат буруу байна.")
        .required("Имэйл шаардлагатай"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE;
        if (!baseURL) {
          alert("API base URL тохируулагдаагүй байна.");
          return;
        }

        const res = await fetch(`${baseURL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });

        if (res.ok) {
          resetForm();
          // ✨ Имэйл дамжуулах — URL параметрээр
          router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
        } else {
          const err = await res.json();
          alert(err.message || "Имэйл илгээж чадсангүй.");
        }
      } catch (error) {
        console.error("❌ Алдаа:", error);
        alert("Сервертэй холбогдож чадсангүй.");
      }
    },
  });

  return (
    <div className="p-6 w-full max-w-md mx-auto relative">
      <button
        onClick={() => router.push("/login")}
        className="absolute top-4 left-4 w-8 h-8 rounded-md border flex items-center justify-center hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <span className="text-xl">←</span>
      </button>

      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-12">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-sm text-gray-600">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="example@gmail.com"
          className="w-full border px-4 py-2 rounded"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <button
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
          className={`w-full py-2 rounded font-semibold transition ${
            formik.dirty && formik.isValid
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
