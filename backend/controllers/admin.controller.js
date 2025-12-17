import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

/* REGISTER */
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, password: hashed });

  res.json({ message: "Admin registered successfully" });
};

/* LOGIN */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",
    admin: {
      name: admin.name,
      email: admin.email,
      profilePic: admin.profilePic,
    },
  });
};

/* LOGOUT */
export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out successfully" });
};

/* FORGOT PASSWORD */
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Email not found" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const link = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;
  await sendMail(email, "Reset Password", `<a href="${link}">Reset</a>`);

  res.status(201).json({ message: "Reset email sent" });
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 10);

  await Admin.findByIdAndUpdate(decoded.id, { password: hashed });

  res.json({ message: "Password updated successfully" });
};
