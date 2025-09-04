"use client";
import {  useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const Router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Response:", data);
        // Redirect to home page or dashboard
        localStorage.setItem("token",data.token)
        Router.push("/home");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-120 h-auto p-6 border-2 border-gray-300 rounded-3xl shadow-lg">
        <div className="flex-col text-center justify-center items-center gap-28">
          <h1 className="text-blue-400 text-3xl">Login</h1>
          <p className="text-xl"></p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 mt-8"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
            />
            <button className="bg-blue-400 cursor-pointer text-white p-3 rounded-lg hover:bg-blue-500 transition duration-300">
              Login
            </button>
          </form>
        </div>
             <div className='text-center mt-6'>
          <p>Don't have an account? <a href="/register" className='text-blue-400 hover:underline cursor-pointer'>Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
