"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import StepOneEmail from "./StepOneEmail";
import StepTwoPassword from "./StepTwoPassword";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function LeftSection() {
  const [step, setStep] = useState(1);

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
    onSubmit: (values) => {
      if (step === 1) {
        setStep(2);
      } else {
        console.log("Form Submitted!", values);
      }
    },
  });

  return (
    <div className="w-1/2 bg-white h-screen flex items-center justify-center px-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-sm flex flex-col items-center space-y-4"
      >
        {/* ← Back button */}
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

        {/* Content */}
        {step === 1 && <StepOneEmail formik={formik} />}
        {step === 2 && <StepTwoPassword formik={formik} />}

        {/* Button */}
        <Button
          type="submit"
          disabled={
            (step === 1 && (!formik.values.email || !!formik.errors.email)) ||
            (step === 2 && !formik.isValid)
          }
          className="w-[416px] h-9 font-semibold bg-black text-white disabled:bg-[#D4D4D8] disabled:text-[#A1A1AA] disabled:cursor-not-allowed"
        >
          {step === 1 ? "Let's Go" : "Create Account"}
        </Button>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
