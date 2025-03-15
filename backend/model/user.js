import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  workoutTarget: {
    type: Number,
    default: 4
  },
  height: {type: Number},
  weight: {type: Number}
});

const User = mongoose.model("User", UserSchema);

export default User;
