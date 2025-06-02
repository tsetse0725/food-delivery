"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex w-full h-full mx-auto shadow-lg border mt-10">
      <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
        <ChevronLeft className="w-6 h-6 mb-6 cursor-pointer text-gray-700 " />
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-500 mb-6">
          Sign up to explore your favorite dishes
        </p>
        <Input placeholder="Enter your email address" className="mb-4" />
        <Button disabled className="w-full">
          Let's go
        </Button>

        <p className="text-sm mt-6 text-gray-600">
          Already have a account? {""}
          <a href="#" className="text-blue-600 hover: no-underline">
            Log in
          </a>
        </p>
      </div>
      <div className="w-1/2 ">
        <img
          src="/signup.png"
          alt="Delivery person"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
