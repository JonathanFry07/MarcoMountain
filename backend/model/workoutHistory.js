import mongoose from "mongoose";

const workoutHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  dateCompleted: {
    type: String, 
    default: function () {
      const now = new Date();
      return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    },
  },
  workoutTitle: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["cardio", "weights", "rest"], required: true },
});

const WorkoutHistory = mongoose.model("WorkoutHistory", workoutHistorySchema);
export default WorkoutHistory;
