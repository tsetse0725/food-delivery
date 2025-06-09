"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function LeftSection() {
  const router = useRouter();

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
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:8000/login", {
          email: values.email,
          password: values.password,
        });
        console.log("Login success:", res.data);
        router.push("/");
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
    <div className="w-1/2 bg-white h-screen flex items-center justify-center px-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-[416px] flex flex-col items-start space-y-4"
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100 transition self-start"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold mt-4">Log in</h1>
        <p className="text-gray-500">Log in to enjoy your favorite dishes.</p>

        <Input
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}

        <p className="text-sm text-black-600 no-underline cursor-pointer">
          Forgot password ?
        </p>

        <Button
          type="submit"
          disabled={
            !formik.values.email || !formik.values.password || !formik.isValid
          }
          className="w-[416px] h-9 font-semibold bg-black text-white disabled:bg-[#D4D4D8] disabled:text-[#A1A1AA] disabled:cursor-not-allowed"
        >
          Let's Go
        </Button>

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
