import { Blog } from "../model/blog.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import logger from "../logs/logger.js";

// ADD BLOG
const addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const imageFile = req.files?.image;

    if (!userId) {
      logger.warn("Unauthorized attempt to create blog");
      return res.status(401).json({ error: "Unauthorized user" });
    }

    let url;
    if (imageFile) {
      url = await uploadToCloudinary(imageFile.tempFilePath);
      logger.info(`Image uploaded for user ${userId}: ${url}`);
    }

    const newBlog = new Blog({ title, content, userId, imageUrl: url });
    await newBlog.save();

    logger.info(`New blog created by user ${userId}: ${title}`);
    res.status(201).json(newBlog);
  } catch (error) {
    logger.error(`Failed to create blog: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: error.message || "Failed to create blog post" });
  }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 3;
    const skip = (pageNumber - 1) * limitNumber;

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limitNumber);
    const blogs = await Blog.find()
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "username profileImage");

    logger.info(`Fetched all blogs - Page ${pageNumber}`);
    res.status(200).json({ blogs, totalPages });
  } catch (error) {
    logger.error(`Failed to fetch all blogs: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};

// GET MY BLOGS
const getMyBlogs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 3;
    const skip = (pageNumber - 1) * limitNumber;
    const userId = req.userId;

    if (!userId) {
      logger.warn("Unauthorized attempt to fetch user blogs");
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const totalBlogs = await Blog.countDocuments({ userId });
    const totalPages = Math.ceil(totalBlogs / limitNumber);
    const blogs = await Blog.find({ userId })
      .skip(skip)
      .limit(limitNumber)
      .populate("userId", "username profileImage");

    logger.info(`Fetched blogs for user ${userId} - Page ${pageNumber}`);
    res.status(200).json({ blogs, totalPages });
  } catch (error) {
    logger.error(`Failed to fetch user's blogs: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Failed to fetch user's blog posts" });
  }
};

// GET SINGLE BLOG
const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      logger.warn(`Blog not found: ${id}`);
      return res.status(404).json({ error: "Blog post not found" });
    }

    logger.info(`Fetched blog ${id}`);
    res.status(200).json(blog);
  } catch (error) {
    logger.error(`Failed to fetch blog ${req.params.id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;

    if (!userId) {
      logger.warn("Unauthorized attempt to update blog");
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      logger.warn(`Blog not found for update: ${id}`);
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (blog.userId.toString() !== userId) {
      logger.warn(`Unauthorized user ${userId} tried to update blog ${id}`);
      return res.status(403).json({ error: "You are not authorized to update this blog post" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
    logger.info(`Blog ${id} updated by user ${userId}`);
    res.status(200).json(updatedBlog);
  } catch (error) {
    logger.error(`Failed to update blog ${req.params.id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Failed to update blog post" });
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      logger.warn("Unauthorized attempt to delete blog");
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      logger.warn(`Blog not found for deletion: ${id}`);
      return res.status(404).json({ error: "Blog post not found" });
    }

    if (blog.userId.toString() !== userId) {
      logger.warn(`Unauthorized user ${userId} tried to delete blog ${id}`);
      return res.status(403).json({ error: "You are not authorized to update this blog post" });
    }

    if (blog.imageUrl) {
      await deleteFromCloudinary(blog.imageUrl);
      logger.info(`Deleted image from Cloudinary for blog ${id}`);
    }

    await Blog.findByIdAndDelete(id);
    logger.info(`Blog ${id} deleted by user ${userId}`);
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete blog ${req.params.id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: "Failed to delete blog post" });
  }
};

export { addBlog, getAllBlogs, updateBlog, deleteBlog, getSingleBlog, getMyBlogs };
