"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [dialog, setDialog] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [limit, setLimit] = useState(3);
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState(false);
  const [edit,setEdit] = useState(false);
    const [blogId,setBlogId] = useState("");
    const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handlePagination = (num:any) => {
    setPageNum(num);
  }

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
    console.log(data);
  };

  const getMyBlogs = async () => {
    const token = localStorage.getItem("token");
    console.log("token",token);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/myBlogs?page=${pageNum}&limit=${limit}`,
      {method:"GET", headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if(res.ok){
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    }else{
        setBlogs([]);
    }

    console.log(data);
  }

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDelete = async (id:any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/deleteBlog/${id}`,
      {method:"DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if(res.ok){
        alert("Blog deleted successfully");
        if(myBlogs){
            setPageNum(1);
            getMyBlogs();
        }else{
            getAllBlogs();
        }
    }else{
        alert(data.error || "Failed to delete blog");
    }
    console.log(data);
    }

  const handleImageChange = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);
      console.log("formdata",formData);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/addBlog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Blog added successfully!");
        setDialog(false);
        setForm({ title: "", content: "", image: null });
        setPreview(null);
        getAllBlogs();
      } else {
        alert(data.error || "Failed to add blog");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (blog:any) => {
    setForm({ title: blog.title, content: blog.content, image: null });
    setPreview(blog.imageUrl || null);
    setDialog(true);
    setEdit(true);
    setBlogId(blog._id);
    };

    const handleEditSubmit = async (e:any) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const token = localStorage.getItem("token");
            formData.append("title", form.title);
            formData.append("content", form.content);
            if (form.image) formData.append("image", form.image);
            console.log("formdata",formData);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/updateBlog/${blogId}`, {
                method: "PUT",
                headers: {
                Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                alert("Blog updated successfully!");
                setDialog(false);
                setForm({ title: "", content: "", image: null });
                setPreview(null);
                setEdit(false);
                if(myBlogs){
                    getMyBlogs();
                }else{
                    getAllBlogs();
                }
            } else {
                alert(data.error || "Failed to update blog");
            }
        } catch (error) {
            console.error(error);
        }
    };

const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    };



  return (
    <div className="px-40 py-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Blog Post</h1>
        <div className="flex gap-4">
           <button
          className="bg-green-400 border-none rounded-xl w-28 h-10 cursor-pointer text-white"
          onClick={() => setDialog(true)}
        >
          + New Blog
        </button>
        <button className="bg-red-400 border-none rounded-xl w-28 h-10 cursor-pointer text-white" onClick={handleLogout}>Logout</button>
        </div>
        
      </div>

      {dialog && (
        <div className="w-full h-full fixed top-0 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-10">
          <div className="w-1/3 h-auto bg-white border-gray-400 border rounded-2xl p-10 ">
            <div className="flex justify-between items-center mb-5 ">
              <h1 className="text-2xl font-bold mb-5">Add New Blog</h1>
              <button
                className="text-red-500 text-4xl -mt-16 cursor-pointer"
                onClick={() => setDialog(false)}
              >
                X
              </button>
            </div>

            <form className="flex flex-col gap-5" onSubmit={edit?handleEditSubmit:handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
              />
              <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
              ></textarea>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-400"
              />

              {preview && (
                <div className="w-28 h-44 border rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <button className="bg-green-400 border-none rounded-xl w-28 h-10 cursor-pointer text-white self-end">
                {edit ? "Update" : "Add"} Blog
              </button>
            </form>
          </div>
        </div>
      )}
        <div className="flex space-x-4 mb-6 justify-center">
  <button
    className={`px-6 py-2 rounded-xl cursor-pointer ${!myBlogs?" bg-green-400 text-white": "bg-gray-200 text-gray-700"}  font-medium shadow-md hover:bg-green-500 transition`}
    onClick={()=>{setMyBlogs(false);setPageNum(1); getAllBlogs();console.log("all")}}
  >
    All Blogs
  </button>
  <button
    className={`px-6 py-2 rounded-xl cursor-pointer ${myBlogs?" bg-green-400 text-white": "bg-gray-200 text-gray-700"}  font-medium shadow-md hover:bg-gray-300 transition`}
    onClick={()=>{setMyBlogs(true);setPageNum(1); getMyBlogs();console.log("my")}}
  >
    My Blogs
  </button>
</div>
<div className="flex gap-6 justify-center items-center">
    <div>
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500">No blogs available.</p>
            ) : (
            blogs?.map((blog:any) => (
                <div key={blog._id} className="border border-gray-400 w-[28rem] h-[32 rem] p-6 rounded-lg mb-6 shadow-md">
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4">{blog.content}</p>
                {myBlogs && <div>
                    <button className="text-white bg-yellow-500 w-16 p-2 rounded-xl cursor-pointer relative -top-20 -right-[17.5rem]  " onClick={()=>handleEdit(blog)}>Edit</button>
                    <button className="text-white bg-red-500 p-2 rounded-xl cursor-pointer relative -top-20 -right-[18rem]  " onClick={()=>handleDelete(blog._id)}>Delete</button>
                    </div>}
                {blog.imageUrl && (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-4" />
                )}
                <p className="text-sm text-blue-500">By: {blog.userId?.username || 'Unknown'}</p>
                </div>
            ))
        )}
    </div>
</div>
<div className="flex justify-center items-center space-x-4 mt-8">
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      className={`rounded-full border cursor-pointer ${
        pageNum === i + 1
          ? "bg-green-400 text-white border-none"
          : "text-black"
      } border-gray-400 w-[50px] h-[50px]`}
      onClick={() => handlePagination(i + 1)}
    >
      {i + 1}
    </button>
  ))}
</div>



    </div>
  );
};

export default Page;
