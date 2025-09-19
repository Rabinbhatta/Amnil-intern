"use client";
import { useRouter } from "next/navigation";
import React from "react";

const EmailVerified = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          ✅ Email Verified!
        </h1>
        <p className="text-gray-700 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition duration-300 cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
