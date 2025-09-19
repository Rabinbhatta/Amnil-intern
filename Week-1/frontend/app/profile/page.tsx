"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Profile = () => {
  const [form, setForm] = useState({
    username: "",
    profileImage: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setForm({ username: data.username, profileImage: null });
          setPreview(data.profileImage || null);
        } else {
          toast.error(data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", form.username);
      if (form.profileImage) formData.append("profileImage", form.profileImage);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setForm({ ...form, profileImage: null }); // Reset file input
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Update Profile</h1>

        {/* Back Button */}
        <button
          onClick={() => router.push("/home")}
          className="mb-4 text-blue-500 hover:underline cursor-pointer"
        >
          ← Back to Home
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 cursor-pointer"
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
