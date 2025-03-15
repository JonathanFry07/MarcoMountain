import mongoose from "mongoose";

const userMarcosSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  calories: {type: Number, required: true},
  protein: {type: Number, required: true},
  carbs: {type: Number, required: true},
  fat: {type: Number, required: true}
});

const UserMarcos = mongoose.model("UserMarcos", userMarcosSchema);
export default UserMarcos;