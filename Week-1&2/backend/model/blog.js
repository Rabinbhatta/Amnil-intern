import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "title is required"] },
        content: { type: String, required: [true, "content is required"] },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "userId is required"] },
        imageUrl: { type: String },
    })

export const Blog = mongoose.model("Blog", blogSchema); 