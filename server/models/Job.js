import mongoose from "mongoose";
import User from "./User.js";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined", "accepted"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
    },
    jobLocation: {
      type: String,
      trim: true,
      default: "My city",
    },
    createdBy: {
      type: mongoose.ObjectId,
      ref: User,
      required: [true, "Please provide the user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
