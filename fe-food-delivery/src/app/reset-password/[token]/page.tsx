"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { user, loading } = useAuth();

  // 🔒 Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  const formik = useFormik({
    initialValues: { password: "", confirm: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "Must include uppercase, lowercase, number, and symbol"
        )
        .required("Password is required"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
    }),
onSubmit: async (values) => {
  setError("");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE;

  console.log("🟡 BASE URL:", baseURL);
  console.log("🟡 Token:", token);
  console.log("🟡 Password:", values.password);

  try {
    const res = await fetch(`${baseURL}/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: values.password }),
    });

    const result = await res.json();
    console.log("✅ Backend response:", result);

    if (res.ok) {
      router.push("/login");
    } else {
      setError(result.message || "Failed to reset password. Link may be expired.");
    }
  } catch (err) {
    console.error("❌ Reset error:", err);
    setError("Something went wrong. Please try again.");
  }
}

  });

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Form side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">Create new password</h2>
          <p className="text-sm text-gray-600">
            Set a new password with a combination of letters and numbers for better security.
          </p>

          {/* Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-4 py-2 rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {/* Confirm */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirm"
            placeholder="Confirm"
            value={formik.values.confirm}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-4 py-2 rounded"
          />
          {formik.touched.confirm && formik.errors.confirm && (
            <p className="text-red-500 text-sm">{formik.errors.confirm}</p>
          )}

          {/* Show password checkbox */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            className={`w-full py-2 rounded font-semibold transition ${
              !formik.isValid || !formik.dirty
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Create password
          </button>
        </form>
      </div>

      {/* Image side */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/signup.png"
          alt="Create new password"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
