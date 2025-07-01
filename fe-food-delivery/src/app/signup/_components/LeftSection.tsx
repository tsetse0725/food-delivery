// 📁 LeftSection.tsx

"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import StepOneEmail from "./StepOneEmail";
import StepTwoPassword from "./StepTwoPassword";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function LeftSection() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const validationSchema = Yup.lazy(() =>
    step === 1
      ? Yup.object({
          email: Yup.string()
            .email("Хүчингүй имэйл байна.")
            .required("Имэйл шаардлагатай"),
        })
      : Yup.object({
          password: Yup.string()
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/,
              "Нууц үг нь том, жижиг үсэг, тоо, тусгай тэмдэгт агуулсан байх ёстой"
            )
            .required("Нууц үг шаардлагатай"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Нууц үг таарахгүй байна.")
            .required("Баталгаажуулах нууц үг шаардлагатай"),
        })
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (step === 1) {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length === 0) {
          formik.setFieldTouched("email", true);
          formik.setFieldValue("email", formik.values.email);
          setStep(2);
        } else {
          console.log("❌ Email validation алдаа:", errors);
        }
        return;
      }

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/auth/signup`; // ✅ ЗАССАН

        const response = await axios.post(apiUrl, {
          email: values.email.toLowerCase().trim(),
          password: values.password,
        });

        if (response.status === 201 || response.status === 200) {
          router.push("/login");
        } else {
          alert("Бүртгэл амжилтгүй. Дахин оролдоно уу.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            alert(error.response.data.message);
          } else {
            alert("Сервертэй холбогдож чадсангүй.");
          }
        } else {
          alert("Тодорхойгүй алдаа гарлаа.");
        }
      }
    },
  });

  const isStepOneValid =
    formik.values.email && !formik.errors.email && formik.touched.email;
  const isStepTwoValid = formik.dirty && formik.isValid;

  return (
    <div className="bg-white h-screen flex items-center justify-center px-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-[416px] flex flex-col items-start space-y-4"
      >
        <div className="self-start">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === 1 && <StepOneEmail formik={formik} />}
        {step === 2 && <StepTwoPassword formik={formik} />}

        <Button
          type="submit"
          disabled={(step === 1 && !isStepOneValid) || (step === 2 && !isStepTwoValid)}
          className="w-[416px] h-9 font-semibold bg-black text-white disabled:bg-[#D4D4D8] disabled:text-[#A1A1AA] disabled:cursor-not-allowed"
        >
          {step === 1 ? "Let's Go" : "Create Account"}
        </Button>

        <p className="text-sm text-gray-600 w-full text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:no-underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
