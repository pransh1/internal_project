import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  createUser,
  uploadUserProfilePic,
  listUsers,
  editUser,
  deleteUser,
  getUserById
} from "../controllers/user.controller.js";

const router = express.Router();

// Admin creates new user
router.post("/create", auth, createUser);

router.get("/list", auth, listUsers);

router.put("/:id", auth, editUser);

router.delete("/:id", auth, deleteUser);

// UPLOAD PROFILE PIC (admin only)
router.post(
  "/upload-profile-pic/:id",
  auth,
  upload.single("photo"),
  uploadUserProfilePic
);

router.get("/:id", auth, getUserById);

export default router;
