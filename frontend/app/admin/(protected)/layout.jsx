"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) return null;

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
