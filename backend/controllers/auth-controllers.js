import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import Workout from "../model/workout.js";
import Exercise from "../model/exercise.js";
import ExerciseHistory from "../model/exerciseHistory.js";
import WorkoutHistory from "../model/workoutHistory.js";

export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }
      const userExits = await User.findOne({ email });
      if (userExits) {
        return res.status(400).json({ message: "Email already in use." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      generateJWTToken(res, user._id);
  
      res.status(201).json({
        success: true,
        message: "User successfully created",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
  
      generateJWTToken(res, user._id);
  
      res.status(200).json({
        success: true,
        message: "User successfully logged in",
      });
    } catch (error) {
      console.log("error logging in", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  };
  export const checkAuth = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      res.status(200).json({
        success: true,
        user: { ...user._doc, password: undefined },
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Error checking authentication",
      });
    };
  };
  export const addWorkout = async (req, res) => {

    const { email } = req.params;
    const { title, type, exercises } = req.body;
  
    if (!title || !type || !exercises) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: title, type, exercises",
      });
    }
  
    try {
      exercises.forEach(exercise => {
        if (!exercise.exerciseId || !exercise.name) {
          return res.status(400).json({
            success: false,
            message: "Exercise ID and name are required",
          });
        }

        // Validation based on workout type
        if (type === 'weights' && (!exercise.sets || !exercise.reps)) {
          return res.status(400).json({
            success: false,
            message: "Weights exercises require sets and reps",
          });
        }

        if (type === 'cardio' && !exercise.distance) {
          return res.status(400).json({
            success: false,
            message: "Cardio exercises require distance",
          });
        }
      });
  
      const newWorkout = new Workout({
        id: Math.floor(Math.random() * 1000000),  
        email,
        title,
        type,
        date: new Date(),
        exercises,
      });
  
      await newWorkout.save();
  
      return res.status(201).json({
        success: true,
        message: "Workout created successfully",
        workout: newWorkout,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error creating workout",
      });
    }
  };
  export const addExercise = async (req, res) => {
    const { name, type, description, bodyPart } = req.body;
  
    if (!name || !type || (type === 'weights' && !bodyPart)) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: name, type, and for weights, a non-empty bodyPart",
      });
    }
  
    if (type !== 'cardio' && type !== 'weights') {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be either 'cardio' or 'weights'",
      });
    }
  
    try {
      const newExercise = new Exercise({
        id: Math.floor(Math.random() * 1000000), 
        name,
        type,
        description: description || "",
        bodyPart: type === 'weights' ? bodyPart : "", 
        dateAdded: new Date(),
      });
  
      await newExercise.save();
  
      return res.status(201).json({
        success: true,
        message: "Exercise created successfully",
        exercise: newExercise,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error creating exercise",
      });
    }
  };

  export const finishWorkout = async (req, res) => {
    const { email, type, results } = req.body;
  
    try {
      if (type === "weights") {
        for (let exercise of results) {
          const newExerciseHistory = new ExerciseHistory({
            email,
            dateCompleted: new Date(),
            name: exercise.name,
            sets: [],
          });
  
          exercise.sets.forEach((set, index) => {
            newExerciseHistory.sets.push({
              reps: set.reps,
              weight: set.weight,
            });
          });
  
          await newExerciseHistory.save();
        }
      } else if (type === "cardio") {
        for (let exercise of results) {
          const newExerciseHistory = new ExerciseHistory({
            email,
            dateCompleted: new Date(),
            name: exercise.name,
            distance: exercise.distance,
            time: exercise.time,
          });
  
          await newExerciseHistory.save();
        }
      }
  
      return res.status(200).json({
        success: true,
        message: "Workout completed successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error finishing exercise",
      });
    }
  };

export const createWorkoutHistory = async (req, res) => {
  const { email, workoutTitle, type } = req.body;

  // Basic error checking for required fields
  if (!email || !workoutTitle || !type) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, workoutTitle, and type are required.",
    });
  }

  try {
    await WorkoutHistory.create({ email, workoutTitle, type });
    return res.status(201).json({
      success: true,
      message: "Workout history created successfully.",
    });
  } catch (error) {
    console.error("Error creating workout history:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating history",
    });
  }
};

export const addRestDay = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields:  are required.",
    });
  }
  try {
    await WorkoutHistory.create({
      email,
      workoutTitle: "Rest Day",
      type: "rest"
    });
    return res.status(201).json({
      success: true,
      message: "Rest day created successfully.",
    });
  } catch (error) {
    console.error("Error creating rest day:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating rest day",
    });
  }
};

export const setWorkoutTarget = async (req, res) => {
  try {
    const { email, workoutTarget } = req.body;

    if (!email || typeof workoutTarget !== "number") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { workoutTarget },
      { new: true } // Return updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Workout target updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
