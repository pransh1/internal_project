"use client";

import { useEffect, useState } from "react";
import { FiMaximize2 } from "react-icons/fi";

export default function DashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adminData");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("admintoken");
    localStorage.removeItem("adminData");
    window.location.href = "/admin/login";
  };

  return (
    <div className="p-6 w-full">
      {/* --- Dashboard Greeting Box --- */}
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-3xl font-bold">
          Hello, {admin?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-600 mt-2">Welcome to your dashboard!</p>
      </div>

    </div>
  );
}
