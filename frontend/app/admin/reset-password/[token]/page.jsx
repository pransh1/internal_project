"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const submitNewPassword = async () => {
    let valid = true;
    setErrorPassword("");
    setErrorConfirm("");
    setServerError("");

    if (!password) {
      setErrorPassword("Password is required");
      valid = false;
    }

    if (!confirm) {
      setErrorConfirm("Confirm password is required");
      valid = false;
    }

    if (password && confirm && password !== confirm) {
      setErrorConfirm("Passwords do not match");
      valid = false;
    }

    if (!valid) return;

    try {
      await api.post(`/admin/reset-password/${token}`, {
        newPassword: password,
      });

      router.push("/admin/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 w-96 rounded-lg shadow-lg border">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {/* Password Field */}
        <input
          type="password"
          placeholder="New password"
          className={`border w-full p-3 rounded mb-1 focus:ring-2 ${
            errorPassword ? "border-red-500" : "focus:ring-blue-500"
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorPassword && (
          <p className="text-red-500 text-xs mb-3">{errorPassword}</p>
        )}

        {/* Confirm Password Field */}
        <input
          type="password"
          placeholder="Confirm password"
          className={`border w-full p-3 rounded mb-1 focus:ring-2 ${
            errorConfirm ? "border-red-500" : "focus:ring-blue-500"
          }`}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {errorConfirm && (
          <p className="text-red-500 text-xs mb-3">{errorConfirm}</p>
        )}

        {/* Server error */}
        {serverError && (
          <p className="text-red-600 text-sm text-center mb-3">
            {serverError}
          </p>
        )}

        <button
          onClick={submitNewPassword}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition mt-2"
        >
          Change Password
        </button>

        <p className="mt-4 text-center text-sm">
          Back to{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
