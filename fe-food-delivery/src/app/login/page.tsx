"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, tokenChecker } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Хүчингүй имэйл").required("Имэйл шаардлагатай"),
      password: Yup.string().required("Нууц үг шаардлагатай"),
    }),
    onSubmit: async (values) => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"; // ✅ fallback
        const res = await fetch(`${baseURL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);

        const valid = await tokenChecker(data.token);
        if (valid) {
          router.push("/");
        } else {
          alert("Токен хүчингүй байна.");
        }
      } catch (error: any) {
        alert(error.message || "Нэвтрэхэд алдаа гарлаа.");
      }
    },
  });

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Зүүн тал */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-sm space-y-4"
        >
          <button
            onClick={() => router.push("/signup")}
            type="button"
            className="w-8 h-8 rounded-[5%] border flex items-center justify-center bg-white shadow hover:bg-gray-100 transition"
            aria-label="Back"
          >
            <span className="text-xl">←</span>
          </button>

          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-gray-500">
            Log in to enjoy your favorite dishes
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <p className="text-sm">
            <a href="/forgot-password" className="text-black hover:underline">
              Forgot password?
            </a>
          </p>

          <button
            type="submit"
            disabled={!(formik.dirty && formik.isValid)}
            className={`w-full py-2 rounded font-semibold transition ${
              formik.dirty && formik.isValid
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Log in
          </button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>

      {/* Баруун тал */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/signup.png"
          alt="Login Visual"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
