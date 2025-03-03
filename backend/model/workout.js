import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  title: { type: String, required: true },
  type: { type: String, enum: ['cardio', 'weights'], required: true },
  date: { type: Date, required: true },
  exercises: [
    {
      exerciseId: { type: Number, required: true },  
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    }
  ]
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;