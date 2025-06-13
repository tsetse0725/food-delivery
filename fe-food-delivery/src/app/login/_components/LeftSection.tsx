"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/app/_components/UserProvider";

export default function LeftSection() {
  const router = useRouter();
  const { tokenChecker } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Хүчингүй имэйл байна.")
        .required("Имэйл шаардлагатай"),
      password: Yup.string().required("Нууц үг шаардлагатай"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          "https://food-delivery-zuu9.onrender.com/login",
          {
            email: values.email,
            password: values.password,
          }
        );

        console.log("Login success:", res.data);
        localStorage.setItem("token", res.data.token);
        await tokenChecker(res.data.token);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            alert(error.response.data.message);
          }
        } else {
          alert("Алдаа гарлаа.");
        }
      }
    },
  });

  return (
    <div className="w-full md:w-1/2 bg-white h-screen flex items-center justify-center px-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-[416px] flex flex-col items-start space-y-4"
      >
        {/* Back товч */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100 transition self-start"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Гарчиг */}
        <h1 className="text-2xl font-bold mt-4">Log in</h1>
        <p className="text-gray-500">Log in to enjoy your favorite dishes.</p>

        {/* Email input */}
        <Input
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        {/* Password input */}
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}

        {/* Forgot password линк */}
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline self-start"
        >
          Forgot password?
        </Link>

        {/* Submit товч */}
        <Button
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
          className="w-[416px] h-9 font-semibold bg-black text-white disabled:bg-[#D4D4D8] disabled:text-[#A1A1AA] disabled:cursor-not-allowed"
        >
          Let's Go
        </Button>

        {/* Sign up линк */}
        <p className="text-sm text-gray-600 w-full text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:no-underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
