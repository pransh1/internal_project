import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePic: String,
});

export default mongoose.model("Admin", adminSchema);
