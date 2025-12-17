"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [admin, setAdmin] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("adminData");
    if (saved) setAdmin(JSON.parse(saved));
  }, []);

  const menu = [
    { name: "Dashboard", icon: HiOutlineHome, href: "/admin/dashboard" },
    { name: "User Management", icon: HiOutlineUsers, href: "/admin/users" },
  ];

  const logout = () => {
    localStorage.removeItem("admintoken");
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  };

  return (
    <div
      className={`
        h-screen bg-blue-900 text-white fixed left-0 top-0 z-50
        flex flex-col shadow-2xl
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${expanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 p-5">
        <img
          src={admin?.profilePic || "/admin-avatar.png"}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          alt="Admin"
        />

        <div
          className={`
            overflow-hidden
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}
          `}
        >
          <p className="text-sm font-semibold whitespace-nowrap">
            {admin?.name || "Admin"}
          </p>
          <p className="text-xs text-blue-200 whitespace-nowrap">
            {admin?.email}
          </p>
        </div>
      </div>

      {/* ================= NAV ITEMS ================= */}
      <nav className="mt-6 flex flex-col gap-1 px-2">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                group flex items-center gap-4
                px-4 py-3 rounded-xl
                transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${active
                  ? "bg-blue-700 shadow-md"
                  : "hover:bg-blue-800"}
              `}
            >
              {/* ICON */}
              <div
                className="
                  w-8 h-8 flex items-center justify-center
                  transition-transform duration-400 ease-out
                  group-hover:scale-110
                "
              >
                <Icon size={22} />
              </div>

              {/* TEXT */}
              <span
                className={`
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                  ${expanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3"}
                `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="mt-auto px-2 pb-4">
        <button
          onClick={logout}
          className="
            group flex items-center gap-4 w-full
            px-4 py-3 rounded-xl
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            hover:bg-blue-800
          "
        >
          <div
            className="
              w-8 h-8 flex items-center justify-center
              transition-transform duration-400 ease-out
              group-hover:scale-110
            "
          >
            <HiOutlineLogout size={22} />
          </div>

          <span
            className={`
              text-sm font-medium whitespace-nowrap
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${expanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-3"}
            `}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
