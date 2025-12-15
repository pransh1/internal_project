import  Admin  from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

const registerAdmin = async(req, res) => {
  const {name, email, password} = req.body;

  // Hash the admin password
  const hashed = await bcrypt.hash(password, 10);

  // Save admin into database
  await Admin.create({name,email, password: hashed});
  res.json({ message: "Admin registered" });
};

const loginAdmin = async(req, res) => {
  const {email, password} = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({email});
  if(!admin) {
    return res.status(400).json({ message: "Invalid email" });
  }

  // Compare password
  const match = await bcrypt.compare(password, admin.password);
  if(!match) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Create JWT token
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.send({token});

}

const forgetPassword = async(req, res) => {
  const {email} = req.body;

  const admin = await Admin.findOne({email});

  if(!admin) {
    return res.status(400).json({ message: "Email not found" });
  }
  
  // Token valid for 10 minutes
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
 
  // Frontend will use this token to reset password
  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // Send reset email
  await sendMail(email, "Reset Password", `
        <p>Click below to reset password:</p>
        <a href="${link}">Reset Password</a>
  `);

  res.json({ message: "Email sent" });
};

const resetPassword = async(req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Decode JWT token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);
   // Update admin password
  await Admin.findByIdAndUpdate(decoded.id, { password: hashed });

  res.json({ message: "Password updated" });
}

export {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword
};

