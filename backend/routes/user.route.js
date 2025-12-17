import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  createUser,
  uploadUserProfilePic,
  listUsers,
  editUser,
  deleteUser,
  restoreUser,
  listDeletedUsers,
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

router.put("/restore/:id", auth, restoreUser);
router.get("/deleted", auth, listDeletedUsers);


router.get("/:id", auth, getUserById);

export default router;
