"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import UserTable from "@/components/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Prevents pre-hydration setState

    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        const res = await api.get("/user/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err) {
        console.log("Error loading users:", err);
      }
    };

    loadUsers();
  }, [mounted]);

  const handleEdit = (user) => {
    router.push(`/admin/users/edit/${user._id}`);
  };

  const handleDelete = async (user) => {
    if (!confirm(`Delete ${user.name}?`)) return;

    try {
      const token = localStorage.getItem("admintoken");

      await api.delete(`/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // reload user list
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  if (!mounted) return null; // Prevents UI flicker

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold">User Management</h1>

        <button
          onClick={() => router.push("/admin/users/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>

      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
