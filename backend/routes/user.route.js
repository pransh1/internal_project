import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  createUser,
  uploadUserProfilePic,
  userLogin
} from "../controllers/user.controller.js";

const router = express.Router();

// Admin creates new user
router.post("/create", auth, createUser);

// Admin uploads user profile picture
router.post("/upload-profile-pic/:id",auth,upload.single("photo"),uploadUserProfilePic);

// User Login (open route)
router.post("/login", userLogin);

export default router;
