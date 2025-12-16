"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    if (!token) {
      setIsAuth(false);

      // block protected pages
      if (!pathname.includes("/admin/login") && !pathname.includes("/admin/register")) {
        router.push("/admin/login");
      }
    } else {
      setIsAuth(true);
    }
  }, [pathname]);

  // LOGIN / REGISTER pages 
  if (!isAuth) {
    return <>{children}</>;
  }

  // AUTHENTICATED PAGES
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-20">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
