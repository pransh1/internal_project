import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connect.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();

// Enable CORS across API
app.use(cors());

// Parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// PORT 
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Server running successfully"));

// route 
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
