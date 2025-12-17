"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const router = useRouter();

  // ---------------- LOGIN ----------------
  const login = async () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!pwd) newErrors.pwd = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      const res = await api.post("/admin/login", {
        email,
        password: pwd,
      });

      // ✅ STORE ADMIN INFO ONLY (NO TOKEN)
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));

      router.push("/admin/dashboard");
    } catch {
      setErrors({ form: "Invalid credentials" });
    }
  };
  

  // ---------------- FORGOT PASSWORD ----------------
  const sendResetLink = async () => {
    if (!forgotEmail) {
      setErrors({ forgotEmail: "Email is required" });
      return;
    }

    try {
      await api.post("/admin/forgot-password", { email: forgotEmail });

      setToast("Reset link sent to your email");
      setShowForgot(false);
      setForgotEmail("");
      setErrors({});

      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setErrors({
        forgotEmail: "Failed to send reset link",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50
          bg-green-600 text-white
          px-4 py-2 rounded-lg shadow-lg
          text-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* LOGIN CARD */}
      <div className="bg-white p-8 shadow-lg rounded-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {errors.form && (
          <p className="text-red-600 text-sm text-center mb-3">
            {errors.form}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "", form: "" }));
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setErrors((p) => ({ ...p, pwd: "", form: "" }));
          }}
          className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.pwd && (
          <p className="text-red-500 text-xs mt-1">{errors.pwd}</p>
        )}

        {/* LOGIN BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            onClick={login}
            className="w-[260px] bg-blue-600 text-white py-3 rounded-lg
              font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

        {/* FORGOT + REGISTER */}
        <div className="text-center mt-4 text-sm">
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </span>

          <span className="mx-2 text-gray-400">|</span>

          <a
            href="/admin/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </a>
        </div>
      </div>

      {/* ---------------- FORGOT PASSWORD MODAL ---------------- */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
          flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-xl border">

            <h3 className="text-xl font-semibold mb-4 text-center">
              Reset Password
            </h3>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => {
                setForgotEmail(e.target.value);
                setErrors((p) => ({ ...p, forgotEmail: "" }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.forgotEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.forgotEmail}
              </p>
            )}

            <button
              onClick={sendResetLink}
              className="w-full mt-4 bg-blue-600 text-white py-3
                rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>

           
            <button
              onClick={() => {
                setShowForgot(false);
                setErrors({});
                setForgotEmail("");
              }}
              className="w-full mt-3 border border-gray-300 py-2 rounded-lg
                text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
