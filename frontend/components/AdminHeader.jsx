"use client";

import { useState, useEffect } from "react";

export default function AdminHeader() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminData");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  return (
    <div className="w-full flex justify-end px-6 py-4">
      <div className="flex items-center gap-3 bg-white border rounded-2xl shadow-sm 
                      px-4 py-2 cursor-default">
        <img
          src={admin?.profilePic || "/admin-avatar.png"}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile"
        />

        <div className="leading-tight">
          <p className="font-semibold text-sm">{admin?.name || "Admin"}</p>
          <p className="text-xs text-gray-500">{admin?.email}</p>
        </div>
      </div>
    </div>
  );
}
