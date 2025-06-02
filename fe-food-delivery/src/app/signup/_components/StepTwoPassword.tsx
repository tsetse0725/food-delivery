import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FormikProps } from "formik";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function StepTwoPassword({
  formik,
}: {
  formik: FormikProps<FormValues>;
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-1 ">Create a strong password</h1>
      <p className="text-gray-500 mb-3">
        Create a strong password with letters, numbers.
      </p>

      <Input
        name="password"
        type={show ? "text" : "password"}
        placeholder="Password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        className={`w-[416px] h-9 ${
          formik.touched.password && formik.errors.password
            ? "border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <div className="min-h-[1px]">
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}
      </div>

      <Input
        name="confirmPassword"
        type={show ? "text" : "password"}
        placeholder="Confirm"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.confirmPassword}
        className={`w-[416px] h-9 ${
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? "border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <div className="min-h-[1px]">
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {formik.errors.confirmPassword}
          </p>
        )}
      </div>
      <label className="text-sm flex gap-2 items-center w-full max-w-[416px]">
        <input type="checkbox" onChange={() => setShow(!show)} />
        Show password
      </label>
    </>
  );
}
