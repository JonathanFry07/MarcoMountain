import mongoose from "mongoose";

const exerciseHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  dateCompleted: { 
    type: Date, 
    default: Date.now 
  },
  name: { 
    type: String, 
    required: true 
  },
  sets: [
    {
      setNumber: { type: Number },
      reps: { type: Number },     
      weight: { type: Number },      
    },
  ],
  distance: { type: Number }, 
});

const ExerciseHistory = mongoose.model("ExerciseHistory", exerciseHistorySchema);
export default ExerciseHistory;
