import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  forgetPassword,
  resetPassword,
} from "../controllers/admin.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

// auth check
router.get("/me", auth, (req, res) => {
  res.json({ ok: true });
});

export default router;
