import express from "express";
import { Login, Logout, Register } from "../controllers/AuthController.js";
import { isAuthenticated } from "../config/isAuthenticated.js";
const router=express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
export default router;