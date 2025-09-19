"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [dialog, setDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setDialog(true);
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const closeDialog = () => {
    setDialog(false);
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-120 h-auto p-6 border-2 border-gray-300 rounded-3xl shadow-lg">
        <div className="flex-col text-center justify-center items-center gap-28">
          <h1 className="text-green-400 text-3xl">Register</h1>
          <p className="text-xl">Create an account</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
            />
            {/* Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-green-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </div>
            <button
              type="submit"
              className="bg-green-400 text-white p-3 rounded-lg hover:bg-green-500 transition duration-300 cursor-pointer"
            >
              Register
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-green-400 hover:underline cursor-pointer">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Modal dialog */}
      {dialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-4">Registration Successful!</h2>
            <p className="mb-6">
              ✅ Please check your email to verify your account before logging in.
            </p>
            <button
              onClick={closeDialog}
              className="bg-green-400 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
