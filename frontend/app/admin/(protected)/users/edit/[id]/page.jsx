"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/axios";
import {
  ROLES,
  EmploymentTypes,
  UserManagers,
  PROJECTS,
} from "@/utils/constants";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("/default-user.png");

  // ---------------- Load User Details ------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        const res = await api.get(`/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm(res.data);

        if (res.data.profilePic) {
          setPreview(res.data.profilePic);
        } else {
          setPreview("");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to load user");
      }
    };

    loadUser();
  }, [id]);

  // ---------------- Input Handlers ------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview("/default-user.png");
  };

  // ---------------- Update User Details ------------------
  const updateUser = async () => {
    try {
      const token = localStorage.getItem("admintoken");

      // Update user text fields
      await api.put(`/user/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Upload profile image if selected
      if (photo) {
        const fd = new FormData();
        fd.append("photo", photo);

        await api.post(`/user/upload-profile-pic/${id}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("User updated successfully!");
      router.push("/admin/users");
    } catch (err) {
      console.log(err);
      alert("Failed to update user");
    }
  };

  if (!form) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">Edit User</h1>

      <div className="grid grid-cols-3 gap-10">

        {/* LEFT – FORM */}
        <div className="col-span-2">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="admin-label">Name</label>
              <input name="name" value={form.name} className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Email</label>
              <input name="email" value={form.email} className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">DOB</label>
              <input type="date" name="dob" value={form.dob?.substring(0, 10)} className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Joining Date</label>
              <input type="date" name="joiningDate" value={form.joiningDate?.substring(0, 10)} className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Role</label>
              <select name="role" value={form.role} className="admin-input mt-1" onChange={handleChange}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div>
              <label className="admin-label">User Manager</label>
              <select name="userManager" value={form.userManager} className="admin-input mt-1" onChange={handleChange}>
                {UserManagers.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div>
              <label className="admin-label">Project</label>
              <select name="project" value={form.project} className="admin-input mt-1" onChange={handleChange}>
                {PROJECTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="admin-label">Employment Type</label>
              <select name="employmentType" value={form.employmentType} className="admin-input mt-1" onChange={handleChange}>
                {EmploymentTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <label className="mt-4 block">Address</label>
          <textarea name="address" value={form.address} rows={3} className="admin-input mt-1" onChange={handleChange} />

          <label className="mt-4 block">Phone</label>
          <input name="phone" value={form.phone} className="admin-input mt-1" onChange={handleChange} />

          <div className="flex justify-center mt-10">
            <button
              onClick={updateUser}
              className="w-[260px] bg-green-600 text-white py-3 rounded-lg
               font-semibold text-base
               hover:bg-green-700 transition"
            >
              Update User
            </button>
          </div>
        </div>

        {/* RIGHT – PROFILE IMAGE */}
        <div className="flex flex-col items-center">

          {preview ? (
            <img src={preview} className="w-44 h-44 rounded-full object-cover border shadow" />
          ) : (
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center
              text-white text-6xl font-bold border shadow"
              style={{ background: form.avatarColor || "#6C5CE7" }}
            >
              {form.avatarInitial || "U"}
            </div>
          )}

          <p className="mt-4 font-semibold">Profile Image</p>

          <input
            type="file"
            id="photoInput"
            className="hidden"
            accept="image/*"
            onChange={handlePhoto}
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => document.getElementById("photoInput").click()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Change
            </button>

            <button
              onClick={removePhoto}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        </div>

      </div>
    </div>
  );

}
