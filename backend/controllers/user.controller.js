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
  } = req.body;

  // Generate employee ID
  const employeeId = await generateEmployeeId();

  // Generate random auto password
  const rawPassword = generatePassword();
  const hashed = await bcrypt.hash(rawPassword, 10);

  // Store user in DB
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
  });

  // Send user their credentials via email
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

  res.json({ message: "User created successfully", user: newUser });
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

    res.json({
      message: "User profile picture updated",
      url: uploaded.secure_url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * USER LOGIN
 * Users log in using email + the auto-generated password sent to email
 * Returns a JWT token so user can access their profile
 */

export const userLogin = async(req, res) => {
  const {email, password} = req.body;
  
  // Check if user exists
  const user = await User.findOne({email});
  if(!user) {
    return res.status(401).json({message: "Invalid email"});
  }

  // Validate password
  const match = await bcrypt.compare(password, user.password);
  if(!match) {
    return res.status(401).json({message: "Invalid password"});
  }

  // Create login token
  const token = jwt.sign({ id: user._id },process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic
    }
  });
};

