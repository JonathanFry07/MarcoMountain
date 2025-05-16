import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  email: {
    type: String,
    required: true,
    trim: true,
  },
  title: { type: String, required: true },
  type: { type: String, enum: ['cardio', 'weights'], required: true },
  date: { type: Date, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number},
      reps: { type: Number },
      distance: { type: Number }
    }
  ],
  bodyweight: { type: Boolean},
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;