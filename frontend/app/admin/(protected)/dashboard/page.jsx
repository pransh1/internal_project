"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";

export default function DashboardPage() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminData");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  const logout = async () => {
    await api.post("/admin/logout"); // ✅ clears cookie
    localStorage.removeItem("adminData");
    window.location.href = "/admin/login";
  };

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-3xl font-bold">
          Hello, {admin?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard!</p>
      </div>
    </div>
  );
}
