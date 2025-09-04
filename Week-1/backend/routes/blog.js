import expresss from "express";
import { getAllBlogs, addBlog, updateBlog, deleteBlog,getSingleBlog,getMyBlogs } from "../controller/blog.js";
import { authorize } from "../middleware/authorization.js";


const router = expresss.Router();

router.get("/allBlogs",getAllBlogs);
router.post("/addBlog",authorize,addBlog);
router.get("/myBlogs",authorize,getMyBlogs);
router.get("/getBlogById/:id",getSingleBlog);
router.put("/updateBlog/:id",updateBlog);
router.delete("/deleteBlog/:id",authorize,deleteBlog);

export default router;