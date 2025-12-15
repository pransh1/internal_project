import mongoose from "mongoose";
import {
  ROLES,
  UserManagers,
  EmploymentTypes,
  PROJECTS
} from "../constants.js";

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  profilePic: {
    type: String,
    default: "" 
  },

  dob: {
    type: Date,
    required: true
  },

  joiningDate: {
    type: Date,
    required: true
  },

  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true
  },

  userManager: {
    type: String,
    enum: Object.values(UserManagers),
    required: true
  },

  project: {
    type: String,
    enum: Object.values(PROJECTS),
    required: true
  },

  employmentType: {
    type: String,
    enum: Object.values(EmploymentTypes),
    required: true
  },

  address: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
