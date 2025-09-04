"use client";
import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

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
      alert(data.message);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-120 h-auto p-6 border-2 border-gray-300 rounded-3xl shadow-lg">
        <div className="flex-col text-center justify-center items-center gap-28">
          <h1 className="text-green-400 text-3xl">Register</h1>
          <p className="text-xl">Create an account</p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 mt-8"
          >
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
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
            />
            <button className="bg-green-400 text-white p-3 rounded-lg hover:bg-green-500 transition duration-300 cursor-pointer">
              Register
            </button>
          </form>
        </div>
             <div className='text-center mt-6'>
          <p>Already have an account? <a href="/login" className='text-green-400 hover:underline cursor-pointer'>Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
