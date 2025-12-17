"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import UserTable from "@/components/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [nameSort, setNameSort] = useState(null);
  const [toast, setToast] = useState("");


  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || showDeleted) return;

    const loadUsers = async () => {
      try {
        
        const res = await api.get("/user/list");
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    loadUsers();
  }, [mounted, showDeleted]);

  useEffect(() => {
    if (!mounted || !showDeleted) return;

    const loadDeletedUsers = async () => {
      try {
        const res = await api.get("/user/deleted");
        setDeletedUsers(res.data);
      } catch (err) {
        console.error("Error loading deleted users:", err);
      }
    };

    loadDeletedUsers();
  }, [mounted, showDeleted]);

  const isWithinDateRange = (date, range) => {
    const now = new Date();
    const d = new Date(date);;

    if (range === "today") {
      return now.toDateString() === d.toDateString();
    }
    if (range === "week") {
      return now - d <= 7 * 24 * 60 * 60 * 1000;
    }
    if (range === "month") {
      return now - d <= 30 * 24 * 60 * 60 * 1000;
    }
    if (range === "six_month") {
      return now - d <= 180 * 24 * 60 * 60 * 1000;
    }
    return true;
  }

  const activeList = showDeleted ? deletedUsers : users;

  const filteredUsers = (activeList || [])
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => typeFilter ? user.employmentType === typeFilter : true)
    .filter((user) => dateFilter ? isWithinDateRange(user.joiningDate, dateFilter) : true)
    .sort((a, b) => {
      if (!nameSort) return 0;
  
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
  
      if (nameSort === "asc") return nameA.localeCompare(nameB);
      if (nameSort === "desc") return nameB.localeCompare(nameA);
      return 0;
    });

  const handleEdit = (user) => {
    router.push(`/admin/users/edit/${user._id}`);
  };

  const handleDelete = async (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {

      await api.delete(`/user/${selectedUser._id}`);

      setUsers((prev) =>
        prev.filter((u) => u._id !== selectedUser._id)
      );

      setShowDeleteModal(false);
      setSelectedUser(null);

      setToast("User deleted successfully");
      setTimeout(() => setToast(""), 3000);
    } catch (error) {
      console.log("Delete failed:", err);
    }
  }

  const handleRestore = (user) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!selectedUser) return;

    try {

      await api.put(`/user/restore/${selectedUser._id}`);

      // Remove from deleted list
      setDeletedUsers((prev) =>
        prev.filter((u) => u._id !== selectedUser._id)
      );

      // Add back to active users
      setUsers((prev) => [selectedUser, ...prev]);

      setShowRestoreModal(false);
      setSelectedUser(null);

      setToast("User restored successfully");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.log("Restore failed:", err);
    }
  };

  const fieldClass =
    "h-10 min-w-[150px] px-4 pr-10 text-sm font-medium text-gray-700 " +
    "bg-white border border-gray-300 rounded-lg shadow-sm " +
    "flex items-center leading-none " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "hover:border-gray-400 transition";


  if (!mounted) return null; // Prevents UI flicker

  return (
    <div className="p-6">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50
                  bg-gray-900 text-white
                  px-4 py-2 rounded-lg shadow-lg
                  text-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-[360px] p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete User
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser?.name}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-sm rounded-md border border-gray-300
                     hover:bg-gray-100 transition"
              >
                No
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-md
                     bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-[360px] p-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Restore User
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Do you want to restore{" "}
              <span className="font-semibold">{selectedUser?.name}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-sm rounded-md border border-gray-300
            hover:bg-gray-100 transition"
              >
                No
              </button>

              <button
                onClick={confirmRestore}
                className="px-4 py-2 text-sm rounded-md
            bg-green-600 text-white hover:bg-green-700 transition"
              >
                Yes, Restore
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">

        {/* LEFT */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {showDeleted ? "Deleted Users" : "All Users"}
          </h1>

        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`${fieldClass} appearance-none`}

            >
              <option value="">Type</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERN">Intern</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Joining Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`${fieldClass} appearance-none`}
            >
              <option value="">Joining Date</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 1 Month</option>
              <option value="six_month">Last 6 Months</option>
            </select>


            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Deleted Users Checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300
      text-blue-600 focus:ring-blue-500"
            />
            Show Deleted
          </label>

          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${fieldClass} appearance-none`}
          />


          {/* ADD USER ICON */}
          <button
            onClick={() => router.push("/admin/users/create")}
            title="Add User"
            className="h-9 w-9 flex items-center justify-center
      rounded-full bg-blue-600 text-white
      hover:bg-blue-700 transition"
          >
            +
          </button>

        </div>
      </div>
      {/* <hr className="my-4 border-t border-gray-300" /> */}

      {/* HEADER + FILTERS */}
      <div className="flex justify-between items-center mt-4">
        {/* left + right content */}
      </div>

      {/* DIVIDER */}
      <hr className="my-4 border-t border-gray-300" />

      {/* TABLE */}
      <UserTable
  users={filteredUsers}
  onEdit={showDeleted ? null : handleEdit}
  onDelete={showDeleted ? null : handleDelete}
  onRestore={showDeleted ? handleRestore : null}
  isDeletedView={showDeleted}
  nameSort={nameSort}
  setNameSort={setNameSort}
/>

      {filteredUsers.length === 0 && (
        <div className="mt-10 text-center text-gray-500 text-sm">
          {showDeleted
            ? "No deleted users found"
            : "No users found"}
        </div>
      )}

      {/* <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} /> */}
    </div>
  );
}
