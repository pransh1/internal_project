/**
 * USER CONTROLLER
 * Handles:
 *  - Creating new users (admin only)
 *  - Auto generating employee IDs
 *  - Sending credentials to user email
 *  - Admin uploading user profile picture (User cannot upload)
 */

import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import { sendMail } from "../utils/sendMail.js";
import { generatePassword } from "../utils/generatePassword.js";

/**
 * Auto-generate employee ID
 * Format: EMP001, EMP002, EMP003...
 */
const generateEmployeeId = async () => {
  const last = await User.findOne().sort({ createdAt: -1 });

  if (!last) return "EMP001";

  const lastNum = parseInt(last.employeeId.replace("EMP", ""));
  const next = lastNum + 1;

  return "EMP" + String(next).padStart(3, "0");
};

/**
 * Create a new user (Admin only)
 * Admin provides:
 *  - Personal details
 *  - Professional details
 *  - Employment information
 * User is emailed their login credentials.
 */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      dob,
      joiningDate,
      role,
      userManager,
      project,
      employmentType,
      address,
      phone,
      profilePic,
      avatarInitial,
      avatarColor
    } = req.body;

    const firstLetter = name?.charAt(0)?.toUpperCase() || "U";
    const bg = "#" + Math.floor(Math.random()*16777215).toString(16);

    // Generate employee ID
    const employeeId = await generateEmployeeId();

    // Auto-password
    const rawPassword = generatePassword();
    const hashed = await bcrypt.hash(rawPassword, 10);

    let profilePicUrl = "";

    // ⬅If admin uploaded picture, upload to Cloudinary
    if (req.file) {
      const fileBuffer = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${fileBuffer}`;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "user_profiles",
      });

      profilePicUrl = uploadResult.secure_url;
    }

    // Save user in DB
    const newUser = await User.create({
      employeeId,
      name,
      email,
      password: hashed,
      dob,
      joiningDate,
      role,
      userManager,
      project,
      employmentType,
      address,
      phone,
      profilePic: profilePicUrl,
      avatarInitial: firstLetter,
      avatarColor: bg
    });

    // email credentials
    await sendMail(
      email,
      "Your Account Details",
      `
        <h3>Welcome ${name}</h3>
        <p>Your account has been created by the Admin.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${rawPassword}</p>
      `
    );

    return res.json({ message: "User created successfully", user: newUser });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

/**
 * Admin uploads user profile picture
 * User cannot upload their own image
 */
export const uploadUserProfilePic = async (req, res) => {
  try {
    // Convert file buffer → Base64 string
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(dataURI, {
      folder: "user_profiles",
    });

    // Save URL in database
    await User.findByIdAndUpdate(req.params.id, {
      profilePic: uploaded.secure_url,
    });

    return res.json({
      message: "User profile picture updated",
      url: uploaded.secure_url,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL USERS (Admin only)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const updated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated successfully", user: updated });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
