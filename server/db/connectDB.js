import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.set("strictQuery", false).connect(url);
};

export default connectDB;
