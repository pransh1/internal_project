"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ VERIFY COOKIE WITH BACKEND
        await api.get("/admin/me");
        setLoading(false);
      } catch {
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <>
      <Sidebar />
      <div className="ml-20">
        <AdminHeader />
        {children}
      </div>
    </>
  );
}
