"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const router = useRouter();

  const login = async () => {
    if (!email || !pwd) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await api.post("/admin/login", { email, password: pwd });

      localStorage.setItem("admintoken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));

      router.push("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  const sendResetLink = async () => {
    if (!forgotEmail) return alert("Enter your email");

    try {
      await api.post("/admin/forgot-password", { email: forgotEmail });

      alert("Reset link sent to your email!");
      setShowForgot(false);
      setForgotEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition mb-4"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition mb-4"
        />

        {/* Login Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={login}
            className="w-[260px] bg-blue-600 text-white py-3 rounded-lg
               font-semibold text-base
               hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

        {/* Forgot + Register */}
        <div className="text-center mt-4 text-sm">

          {/* POPUP FORGOT PASSWORD */}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </span>

          <span className="mx-2 text-gray-400">|</span>

          {/* KEEP REGISTER LINK AS IT IS */}
          <a href="/admin/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </div>

      {/* ---------------- FORGOT PASSWORD MODAL ---------------- */}
      {showForgot && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-xl border relative animate-fadeIn">

            <h3 className="text-xl font-semibold mb-4 text-center">
              Reset Password
            </h3>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3
             focus:outline-none focus:ring-2 focus:ring-blue-500
             transition mb-4"
            />

            <button
              onClick={sendResetLink}
              className="
    w-[85%]
    mx-auto
    block
    bg-blue-600 text-white
    py-3
    rounded-xl
    font-semibold
    text-base
    tracking-wide
    hover:bg-blue-700
    active:scale-[0.98]
    transition-all
  "
            >
              Send Reset Link
            </button>


            <p
              className="text-center mt-4 cursor-pointer text-gray-600 hover:underline"
              onClick={() => setShowForgot(false)}
            >
              Cancel
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
