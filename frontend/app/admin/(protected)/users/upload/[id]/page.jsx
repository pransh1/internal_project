"use client";

import { useState } from "react";
import api from "@/utils/axios";
import { useRouter, useParams } from "next/navigation";

export default function UploadPicPage() {
  const router = useRouter();
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const upload = async () => {
    const token = localStorage.getItem("admintoken");

    const formData = new FormData();
    formData.append("photo", file);

    await api.post(`/user/upload-profile-pic/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Profile photo updated!");
    router.push("/admin/users");
  };

  return (
    <div className="max-w-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Upload Profile Picture</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        className="bg-green-600 mt-4 text-white px-4 py-2 rounded"
        onClick={upload}
      >
        Upload
      </button>
    </div>
  );
}
