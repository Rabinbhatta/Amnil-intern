"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [dialog, setDialog] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [limit, setLimit] = useState(3);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState(false);
  const [edit, setEdit] = useState(false);
  const [blogId, setBlogId] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handlePagination = (num: any) => setPageNum(num);

  useEffect(() => {
    if (myBlogs) {
      getMyBlogs();
    } else {
      getAllBlogs();
    }
  }, [pageNum, myBlogs]);

  const getAllBlogs = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/allBlogs?page=${pageNum}&limit=${limit}`
    );
    const data = await res.json();
    setBlogs(data.blogs || []);
    setTotalPages(data.totalPages || 1);
  };

  const getMyBlogs = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/myBlogs?page=${pageNum}&limit=${limit}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (res.ok) {
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } else {
      setBlogs([]);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/addBlog`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setDialog(false);
        setMyBlogs(false);
        setForm({ title: "", content: "", image: null });
        setPreview(null);
        getAllBlogs();
        toast.success("Blog added successfully");
      } else {
        toast.error(data.message || "Failed to add blog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteBlogId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/deleteBlog/${deleteBlogId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Blog deleted successfully");
        setMyBlogs(false);
      } else {
        toast.error(data.error || "Failed to delete blog");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeleteDialog(false);
      setDeleteBlogId(null);
    }
  };

  const handleEdit = (blog: any) => {
    setForm({ title: blog.title, content: blog.content, image: null });
    setPreview(blog.imageUrl || null);
    setDialog(true);
    setEdit(true);
    setBlogId(blog._id);
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/updateBlog/${blogId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Blog updated successfully");
        setDialog(false);
        setForm({ title: "", content: "", image: null });
        setPreview(null);
        setEdit(false);
        if (myBlogs) getMyBlogs();
        else getAllBlogs();
      } else {
        toast.error(data.error || "Failed to update blog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="px-6 md:px-20 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Blog Posts
        </h1>
        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-white font-medium transition cursor-pointer"
            onClick={() => setDialog(true)}
          >
            + New Blog
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white font-medium transition cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            Profile
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-medium transition cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Toggle All/My Blogs */}
      <div className="flex space-x-4 mb-8 justify-center">
        <button
          className={`px-6 py-2 rounded-xl ${
            !myBlogs
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } font-medium transition cursor-pointer`}
          onClick={() => {
            setMyBlogs(false);
            setPageNum(1);
            getAllBlogs();
          }}
        >
          All Blogs
        </button>
        <button
          className={`px-6 py-2 rounded-xl ${
            myBlogs
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } font-medium transition cursor-pointer`}
          onClick={() => {
            setMyBlogs(true);
            setPageNum(1);
            getMyBlogs();
          }}
        >
          My Blogs
        </button>
      </div>

      {/* Blog List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No blogs available.
          </p>
        ) : (
          blogs.map((blog: any) => (
            <div
              key={blog._id}
              className="border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {blog.content}
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      blog.userId.profileImage ||
                      "data:image/png;base64,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"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {blog.userId?.username || "Unknown"}
                  </span>
                </div>

                {/* Actions */}
                {myBlogs && (
                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                      onClick={() => {
                        setDeleteDialog(true);
                        setDeleteBlogId(blog._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-3 mt-10">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              pageNum === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition cursor-pointer`}
            onClick={() => handlePagination(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Add/Edit Blog Modal */}
      {dialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {edit ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                className="text-red-500 text-2xl font-bold cursor-pointer"
                onClick={() => setDialog(false)}
              >
                ×
              </button>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={edit ? handleEditSubmit : handleSubmit}
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                className="border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              ></textarea>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-lg p-3 cursor-pointer"
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              )}

              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition self-end cursor-pointer">
                {edit ? "Update" : "Add"} Blog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this blog?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition cursor-pointer"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg transition cursor-pointer"
                onClick={() => setDeleteDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
