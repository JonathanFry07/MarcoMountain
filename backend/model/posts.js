import mongoose from "mongoose";

// Create a schema for the post post
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    postType: { type: String, enum: ["cardio", "weights"], required: true },
    activity: { type: String, required: true },
    title: { type: String, required: true },//input
    distance: { type: Number },
    duration: { type: String, required: true },
    pace: { type: String },
    date: { type: String, required: true },
    description: { type: String, required: true },
    kudos: { type: Number, default: 0 },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: String, required: true },
        reps: { type: String, required: true },
        weight: { type: String, required: true },
      },
    ],
    kudosGivenBy: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Posts = mongoose.model("posts", postSchema);
export default Posts;