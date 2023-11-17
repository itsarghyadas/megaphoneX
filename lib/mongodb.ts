import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

const connectDB = async (url = process.env.MONGO_URL) => {
  if (!url) {
    throw new Error("MONGO_URL is not defined");
  }

  // existing database connection
  if (connection.isConnected) {
    console.log("🚀 Using existing MongoDB connection!");
    return;
  }

  // Use new database connection
  try {
    const db = await mongoose.connect(url);
    connection.isConnected = db.connections[0].readyState;
    console.log("🚀 Connected to MongoDB Successfully!");
  } catch (error) {
    console.error("Failed to connect with MongoDB. Check your connection!");
    console.error(error);
    process.exit(1);
  }
};

mongoose.set("strictQuery", true);

export default connectDB;
