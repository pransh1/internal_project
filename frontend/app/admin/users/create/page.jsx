"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import { ROLES, UserManagers, EmploymentTypes, PROJECTS } from "@/utils/constants";

export default function CreateUserPage() {
  const router = useRouter();

  const [errors, setErrors] = useState({});
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

      alert("User Created Successfully!");
      router.push("/admin/users");
    } catch (err) {
      console.log(err);
      alert("Failed to create user");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Create New User</h1>

      {/* IMAGE UPLOAD UI */}
      <div className="flex gap-6 items-center">

        <div className="flex flex-col items-center">
          {photo ? (
            <img
              src={preview}
              className="w-40 h-40 rounded-full object-cover border shadow"
            />
          ) : (
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow border"
              style={{ background: "#6C5CE7" }}
            >
              {form.name ? form.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}


          <p className="mt-3 font-semibold">Profile Image</p>

          <input
            type="file"
            accept="image/*"
            id="photoInput"
            className="hidden"
            onChange={handlePhoto}
          />

          <div className="flex gap-4 mt-3">
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

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4 mt-8">

        <div>
          <label>Full Name</label>
          <input name="name" className="border p-2 w-full mt-1" onChange={handleChange} />
        </div>

        <div>
          <label>Email</label>
          <input name="email" className="border p-2 w-full mt-1" onChange={handleChange} />
        </div>

        <div>
          <label>Date of Birth</label>
          <input type="date" name="dob" className="border p-2 w-full mt-1" onChange={handleChange} />
        </div>

        <div>
          <label>Joining Date</label>
          <input type="date" name="joiningDate" className="border p-2 w-full mt-1" onChange={handleChange} />
        </div>

        {/* FIXED ENUM SELECTS */}
        <div>
          <label>Role</label>
          <select name="role" className="border p-2 w-full mt-1" onChange={handleChange}>
            <option value="">Select Role</option>
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label>User Manager</label>
          <select name="userManager" className="border p-2 w-full mt-1" onChange={handleChange}>
            <option value="">Select Manager</option>
            {UserManagers.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Project</label>
          <select name="project" className="border p-2 w-full mt-1" onChange={handleChange}>
            <option value="">Select Project</option>
            {PROJECTS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Employment Type</label>
          <select name="employmentType" className="border p-2 w-full mt-1" onChange={handleChange}>
            <option value="">Select Type</option>
            {EmploymentTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-4 block">Address</label>
      <textarea name="address" className="border p-2 w-full" rows={3} onChange={handleChange}></textarea>

      <label className="mt-4 block">Phone Number</label>
      <input name="phone" className="border p-2 w-full" onChange={handleChange} />

      <button onClick={createUser} className="bg-green-600 text-white px-6 py-3 rounded mt-6">
        Create User
      </button>

    </div>
  );
}
