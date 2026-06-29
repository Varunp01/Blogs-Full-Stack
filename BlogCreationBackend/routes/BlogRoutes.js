import express from "express";
import { isAuthenticated } from "../config/isAuthenticated.js";
import {
  CreateB,
  DeleteBlog,
  GetBlogByIdForEdit,
  GetBlogBySlug,
  GetMyBlogs,
  GetPublishedBlogs,
  toggleLikeBlog,
  UpdateBlog,
} from "../controllers/BlogController.js";

const router = express.Router();

router.post("/create", isAuthenticated, CreateB);

router.get("/published", GetPublishedBlogs);
router.get("/my-blogs", isAuthenticated, GetMyBlogs);
router.get("/edit/:id", isAuthenticated, GetBlogByIdForEdit);

router.put("/update/:id", isAuthenticated, UpdateBlog);
router.delete("/delete/:id", isAuthenticated, DeleteBlog);
router.patch("/togglelike/:blogId", isAuthenticated, toggleLikeBlog);

router.get("/:slug", GetBlogBySlug);

export default router;