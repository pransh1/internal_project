import express from "express";
import {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin registration 
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

// Forgot password 
router.post("/forgot-password", forgetPassword);

// Reset password using token
router.post("/reset-password/:token", resetPassword);

export default router;
