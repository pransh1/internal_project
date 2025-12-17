"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const register = async () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!pwd) newErrors.pwd = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await api.post("/admin/register", {
        name,
        email,
        password: pwd,
      });

      router.push("/admin/login");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 shadow-xl rounded-2xl w-[450px] border">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Register
        </h2>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: "" }));
          }}
          className="w-full border rounded-lg px-4 py-3"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: "" }));
          }}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setErrors((p) => ({ ...p, pwd: "" }));
          }}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />
        {errors.pwd && <p className="text-red-500 text-xs mt-1">{errors.pwd}</p>}

        {errors.form && (
          <p className="text-red-600 text-sm text-center mt-4">
            {errors.form}
          </p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={register}
            className="w-[260px] bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </div>

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
