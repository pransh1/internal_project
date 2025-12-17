"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatLabel } from "@/utils/formatLabel";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function UserTable({
  users = [],
  onEdit,
  onDelete,
  onRestore,
  isDeletedView = false,
  nameSort,
  setNameSort
}) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">

      <table className="w-full table-fixed border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700 text-sm border-b border-gray-300">
            <th className="p-3 w-[120px] font-semibold border-r border-gray-300">Employee ID</th>
            <th
              onClick={() =>
                setNameSort((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="
    relative p-3 w-[260px] font-semibold border-r border-gray-300
    cursor-pointer select-none
  "
            >
              {/* NAME TEXT */}
              <span>Name</span>

              {/* RIGHT-ALIGNED ARROW */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {nameSort === "asc" ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </span>
            </th>
            <th className="p-3 w-[260px] font-semibold border-r border-gray-300">Email / Phone</th>
            <th className="p-3 w-[160px] font-semibold border-r border-gray-300">Joining Date</th>
            <th className="p-3 w-[130px] font-semibold border-r border-gray-300">Type</th>
            <th className="p-3 w-[120px] font-semibold text-center border-gray-300">Actions</th>
          </tr >
        </thead>

        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-b hover:bg-gray-50 text-sm h-[70px]"
            >
              {/* EMPLOYEE ID */}
              <td className="p-3 border-r border-gray-300">{u.employeeId}</td>

              {/* NAME + ROLE + AVATAR */}
              <td className="p-3 border-r border-gray-300">
                <div className="flex items-center gap-3">
                  {u.profilePic ? (
                    <img
                      src={u.profilePic}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold border"
                      style={{ background: u.avatarColor }}
                    >
                      {u.avatarInitial}
                    </div>
                  )}

                  <div className="flex flex-col leading-[1.1]">
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-gray-500 text-xs tracking-wide">
                      {formatLabel(u.role)}
                    </span>
                  </div>
                </div>
              </td>

              {/* EMAIL + PHONE */}
              <td className="p-3 border-r border-gray-300">
                <div className="flex flex-col leading-[1.1]">
                  <span>{u.email}</span>
                  <span className="text-gray-500 text-xs">{u.phone}</span>
                </div>
              </td>

              {/* JOINING DATE */}
              <td className="p-3 border-r border-gray-300">
                {new Date(u.joiningDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              {/* TYPE */}
              <td className="p-3 border-r border-gray-300">
                {formatLabel(u.employmentType)}
              </td>

              {/* ACTIONS */}
              <td className="p-3 text-center">
                {isDeletedView ? (
                  <button
                    onClick={() => onRestore(u)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Restore
                  </button>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Pencil
                      size={18}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => onEdit(u)}
                    />
                    <Trash2
                      size={18}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => onDelete(u)}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
