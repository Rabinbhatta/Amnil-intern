import expresss from "express";
import { getAllBlogs, addBlog, updateBlog, deleteBlog,getSingleBlog,getMyBlogs } from "../controller/blog.js";
import { authorizeUser } from "../middleware/authorization.js";


const router = expresss.Router();

router.get("/allBlogs",getAllBlogs);
router.post("/addBlog",authorizeUser,addBlog);
router.get("/myBlogs",authorizeUser,getMyBlogs);
router.get("/getBlogById/:id",getSingleBlog);
router.put("/updateBlog/:id",authorizeUser,updateBlog);
router.delete("/deleteBlog/:id",authorizeUser,deleteBlog);

export default router;