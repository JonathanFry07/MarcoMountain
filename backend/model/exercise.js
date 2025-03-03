import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  name: { type: String, required: true },
  type: { type: String, enum: ['cardio', 'weights'], required: true },
  description: { type: String, default: "" },
  bodyPart: { type: String, required: function() { return this.type === 'weights'; }, default: "" }, 
  dateAdded: { type: Date, default: Date.now },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;
