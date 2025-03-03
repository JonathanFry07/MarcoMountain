import mongoose from "mongoose";

const workoutHistorySchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  workoutId: { type: Number, required: true },
  dateCompleted: { type: Date, default: Date.now },
  exerciseDetails: [
    {
      exerciseId: { type: Number, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
      weight: { type: String, required: true },
    },
  ],
});

const WorkoutHistory = mongoose.model("WorkoutHistory", workoutHistorySchema);
module.exports = WorkoutHistory;
