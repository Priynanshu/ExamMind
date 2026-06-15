import mongoose from "mongoose";

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
