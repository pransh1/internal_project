import mongoose from "mongoose";

const connectDb = async() => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('connected to mongodb');
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};

export default connectDb;