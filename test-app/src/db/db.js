import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log("Failed to connect to MongoDB!", error);
    process.exit(1);
  }
};
