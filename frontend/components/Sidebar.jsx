"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { HiOutlineHome, HiOutlineUsers, HiOutlineLogout } from "react-icons/hi";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
      className={`h-screen bg-blue-900 text-white transition-all duration-300 
        ${expanded ? "w-60" : "w-20"}
        flex flex-col fixed left-0 top-0 shadow-xl z-50`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5">
        <div className="bg-white/20 p-2 rounded-lg text-xl">🚀</div>
        {expanded && <h1 className="text-lg font-semibold">Admin</h1>}
      </div>

      {/* Nav Items */}
      <nav className="mt-6 flex flex-col gap-2">
        {menu.map((item, index) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-md cursor-pointer transition 
                ${active ? "bg-blue-700" : "hover:bg-blue-800"}
              `}
            >
              <Icon size={24} />
              {expanded && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div className="mt-auto p-5">
        <button
          onClick={logout}
          className={`flex items-center gap-4 p-4 rounded-md w-full text-left transition
             hover:bg-blue-800`}
        >
          <HiOutlineLogout size={24} />
          {expanded && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
