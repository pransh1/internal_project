import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

// -------------------------------------------
// REGISTER ADMIN  
// -------------------------------------------
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // Prevent duplicate admin
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({ name, email, password: hashed, profilePic:"https://res.cloudinary.com/pransh/image/upload/v1765876848/user_profiles/w4hoxsul8pxtisyrfake.avif" });

    return res.json({ message: "Admin registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------
// LOGIN ADMIN
// -------------------------------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    // Create Token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      message: "Login successful",
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        profilePic: admin.profilePic || "https://res.cloudinary.com/pransh/image/upload/v1765876848/user_profiles/w4hoxsul8pxtisyrfake.avif",
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------
// FORGOT PASSWORD
// -------------------------------------------
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Email not found" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const link = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; 
                    border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <h2 style="text-align:center; color: #333;">Reset Your Password</h2>

          <p>Hello,</p>
          <p>You recently requested to reset your password. Click the button below:</p>

          <!-- RESET BUTTON -->
          <div style="text-align:center; margin: 25px 0;">
            <a href="${link}" 
              style="
                background: #007bff;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 16px;
                display: inline-block;
              ">
              Reset Password
            </a>
          </div>

          <p>If the button above does not work, copy and paste this link in your browser:</p>

          <div style="word-break: break-all; color: #007bff; margin: 10px 0;">
            ${link}
          </div>

          <p>This link will expire in <strong>10 minutes</strong>.</p>

          <p style="margin-top: 30px;">Regards,<br><strong>Admin Team</strong></p>
        </div>
      </div>
    `;

    await sendMail(email, "Reset Password", html);

    return res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------
// RESET PASSWORD
// -------------------------------------------
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(newPassword, 10);

    await Admin.findByIdAndUpdate(decoded.id, { password: hashed });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
}
