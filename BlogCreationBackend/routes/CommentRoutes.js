import express from "express";
import { isAuthenticated } from "../config/isAuthenticated.js";
import { createC, deleteC, getC } from "../controllers/CommentController.js";
const router=express.Router();
router.post("/create", isAuthenticated, createC);
router.get("/get/:blogId", getC);
router.delete("/del/:commentId", isAuthenticated, deleteC);
export default router;