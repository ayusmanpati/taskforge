import mongoose from "mongoose";

// Error handling using try catch block ->
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✔️  MongoDB Connected !");
  } catch (error) {
    console.error("❌ MongoDB Connection Error !", error);
    process.exit(1);
    // process.exit(1) is used in Node.js to stop the program immediately.
  }
};

export default connectDB;
// This connectDB is imported into index.js (of src (main file)) and connectDB fucntions is called to establish connection.
