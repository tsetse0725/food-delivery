import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function StepOneEmail({
  formik,
}: {
  formik: FormikProps<FormValues>;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-gray-500 mb-3">
        Sign up to explore your favorite dishes.
      </p>

      <Input
        name="email"
        placeholder="Enter your email address"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        className={`w-[416px] h-9 ${
          formik.touched.email && formik.errors.email
            ? "border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <div className="min-h-[20px]">
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}
      </div>
    </>
  );
}
