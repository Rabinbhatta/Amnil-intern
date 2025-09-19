"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [forgotDialog, setForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // password toggle
  const [showPassword, setShowPassword] = useState(false);

  const Router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        Router.push("/home");
      } else {
        toast.error(data.message || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Error submitting form", error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Please enter your email.");
    setForgotLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset email sent! Check your inbox.");
        setForgotDialog(false);
        setForgotEmail("");
      } else {
        toast.error(data.message || "Failed to send reset email.");
      }
    } catch (error) {
      toast.error("Failed to send reset email.");
      console.error(error);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-120 h-auto p-6 border-2 border-gray-300 rounded-3xl shadow-lg">
        <div className="flex-col text-center justify-center items-center gap-28">
          <h1 className="text-blue-400 text-3xl">Login</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
            />

            {/* Password field with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
               {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </button>
            </div>

            <button className="bg-blue-400 cursor-pointer text-white p-3 rounded-lg hover:bg-blue-500 transition duration-300">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot password button */}
          <div className="text-right mt-2">
            <button
              onClick={() => setForgotDialog(true)}
              className="text-blue-400 hover:underline text-sm cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        <div className="text-center mt-6">
          <p>
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotDialog && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            <p className="mb-4 text-gray-700">
              Enter your email to receive a password reset link.
            </p>
            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={forgotEmail}
                onChange={handleForgotChange}
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
              />
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending..." : "Send"}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotDialog(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                  disabled={forgotLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
