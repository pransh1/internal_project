"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const router = useRouter();

  const register = async () => {
    if (!name || !email || !pwd) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/admin/register", {
        name,
        email,
        password: pwd,
      });

      alert("Admin registered successfully!");
      router.push("/admin/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-10 shadow-xl rounded-2xl w-[450px] border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Register</h2>

        {/* Name */}
        <input
          type="text"
          className="border w-full p-3 mb-4 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          className="border w-full p-3 mb-4 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="border w-full p-3 mb-4 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        {/* Register Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          onClick={register}
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>

    </div>
  );
}
