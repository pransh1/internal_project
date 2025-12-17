"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import { ROLES, UserManagers, EmploymentTypes, PROJECTS } from "@/utils/constants";

export default function CreateUserPage() {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    joiningDate: "",
    role: "",
    userManager: "",
    project: "",
    employmentType: "",
    address: "",
    phone: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("/default-user.png");

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

  const createUser = async () => {
    try {
      const token = localStorage.getItem("admintoken");

      // Create user (text fields only)
      const res = await api.post("/user/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = res.data.user._id;

      // Upload photo IF SELECTED
      if (photo) {
        const fd = new FormData();
        fd.append("photo", photo);

        await api.post(`/user/upload-profile-pic/${userId}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setToast("User Created Successfully!");
      setTimeout(() => {
        router.push("/admin/users");
      }, 1200);
    } catch (err) {
      console.log(err);
      alert("Failed to create user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Create New User</h1>

      <div className="grid grid-cols-3 gap-10">

        {/* LEFT – FORM */}
        <div className="col-span-2">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="admin-label">Full Name</label>
              <input name="name" className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Email</label>
              <input name="email" className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Date of Birth</label>
              <input type="date" name="dob" className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Joining Date</label>
              <input type="date" name="joiningDate" className="admin-input mt-1" onChange={handleChange} />
            </div>

            <div>
              <label className="admin-label">Role</label>
              <select name="role" className="admin-input mt-1" onChange={handleChange}>
                <option value="">Select Role</option>
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-label">User Manager</label>
              <select name="userManager" className="admin-input mt-1" onChange={handleChange}>
                <option value="">Select Manager</option>
                {UserManagers.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-label">Project</label>
              <select name="project" className="admin-input mt-1" onChange={handleChange}>
                <option value="">Select Project</option>
                {PROJECTS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-label">Employment Type</label>
              <select name="employmentType" className="admin-input mt-1" onChange={handleChange}>
                <option value="">Select Type</option>
                {EmploymentTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="admin-label">Address</label>
          <textarea name="address" rows={3} className="admin-input mt-1" onChange={handleChange} />

          <label className="admin-label">Phone Number</label>
          <input name="phone" className="admin-input mt-1" onChange={handleChange} />

          <div className="flex justify-center mt-10">
            <button
              onClick={createUser}
              className="w-[260px] bg-green-600 text-white py-3 rounded-lg
               font-semibold text-base
               hover:bg-green-700 transition"
            >
              Create User
            </button>
          </div>
        </div>

        {/* RIGHT – PROFILE IMAGE */}
        <div className="flex flex-col items-center">

          {photo ? (
            <img src={preview} className="w-44 h-44 rounded-full object-cover border shadow" />
          ) : (
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center
              text-white text-6xl font-bold border shadow"
              style={{ background: "#6C5CE7" }}
            >
              {form.name ? form.name.charAt(0).toUpperCase() : "U"}
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
              Upload
            </button>

            {photo && (
              <button
                onClick={removePhoto}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );

}
