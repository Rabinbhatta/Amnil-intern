import e from "express";
import { Blog } from "../model/blog.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

const addBlog = async (req, res) => {
    try {

        const { title, content } = req.body;
        const userId = req.userId;
        const imageFile = req.files?.image;
        let url
        if (imageFile) {
            url = await uploadToCloudinary(imageFile.tempFilePath); 
        }
           const newBlog = new Blog({ title, content, userId,imageUrl:url });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create blog post" ,errors: error});
    }
};

const getAllBlogs = async (req, res) => {
    try{
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 3;
        const skip = (pageNumber - 1) * limitNumber;
        const blogs = await Blog.find().skip(skip).limit(limitNumber).populate("userId",'username');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog posts" });
    }
};

const getMyBlogs = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 3;
        const skip = (pageNumber - 1) * limitNumber;
        const  userId  = req.userId;
        const blogs = await Blog.find({ userId }).skip(skip).limit(limitNumber).populate("userId", 'username');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user's blog posts" });
    }   
};

const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog post" });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, authorName } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, authorName },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog post" });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        await deleteFromCloudinary(blog.imageUrl);
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog post" });
    }
};

export { addBlog, getAllBlogs, updateBlog, deleteBlog, getSingleBlog, getMyBlogs };