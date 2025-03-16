import Workout from "../model/workout.js";
import Exercise from "../model/exercise.js";
import WorkoutHistory from "../model/workoutHistory.js";
import CustomExercise from "../model/customExercise.js";
import ExerciseHistory from "../model/exerciseHistory.js";
import UserMarcos from "../model/macros.js";
import User from "../model/user.js";
import Meal from "../model/meal.js";
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getWorkouts = async (req, res) => {
  const { email } = req.params;
  try {
    const workouts = await Workout.find({ email });

    const exerciseIds = new Set();
    workouts.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        exerciseIds.add(ex.exerciseId);
      });
    });

    const exercises = await Exercise.find({
      id: { $in: Array.from(exerciseIds) },
    });

    const exerciseMap = {};
    exercises.forEach((ex) => {
      exerciseMap[ex.id] = ex.name;
    });

    const formattedWorkouts = workouts.map((workout) => {
      const workoutObj = workout.toObject();
      workoutObj.exercises = workoutObj.exercises.map((ex) => ({
        ...ex,
        name: exerciseMap[ex.exerciseId] || "Unknown",
      }));
      return workoutObj;
    });

    return res.status(200).json({
      success: true,
      workouts: formattedWorkouts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving workouts",
    });
  }
};

export const getWorkoutsById = async (req, res) => {
  const { id } = req.params;
  try {
    const workouts = await Workout.findOne({ id });

    const exerciseIds = new Set();
    for (let i = 0; i < workouts.length; i++) {
      for (let j = 0; j < workouts[i].exercises.length; j++) {
        exerciseIds.add(workouts[i].exercises[j].exerciseId);
      }
    }

    const exercises = await Exercise.find({
      id: { $in: Array.from(exerciseIds) },
    });

    const exerciseMap = {};
    exercises.forEach((ex) => {
      exerciseMap[ex.id] = ex.name;
    });

    return res.status(200).json({
      title: workouts.title,
      type: workouts.type,
      workouts: workouts.exercises,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving workouts",
    });
  }
};

export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();

    const filteredExercises = exercises.map((exercise) => {
      const { id, name, type, description, bodyPart } = exercise._doc;
      const result = { id, name, type, description };
      if (bodyPart !== "") {
        result.bodyPart = bodyPart;
      }
      return result;
    });

    return res.status(200).json({
      success: true,
      exercises: filteredExercises,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving exercises",
    });
  }
};

export const getCustomExercises = async (req, res) => {
  const { email } = req.params;
  try {
    const exercises = await CustomExercise.find({ email });

    const filteredExercises = exercises.map((exercise) => {
      const { id, name, type, description, bodyPart } = exercise._doc;
      const result = { id, name, type, description };
      if (bodyPart !== "") {
        result.bodyPart = bodyPart;
      }
      return result;
    });

    return res.status(200).json({
      success: true,
      exercises: filteredExercises,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving exercises",
    });
  }
};

export const getWorkoutHistory = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter: email.",
    });
  }

  try {
    const histories = await WorkoutHistory.find({ email }).select("-_id -__v");

    return res.status(200).json({
      success: true,
      data: histories,
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching workout history.",
    });
  }
};

export const getExerciseHistory = async (req, res) => {
  const { email } = req.params;
  try {
    const history = await ExerciseHistory.find({ email }).select("-_id -__v");

    // Group exercises together by name
    const groupedHistory = {};

    history.forEach((entry) => {
      const { name, sets, distance, time, dateCompleted } = entry;

      if (!groupedHistory[name]) {
        groupedHistory[name] = [];
      }

      const record = { name, dateCompleted };

      if (sets && sets.length > 0) {
        record.sets = sets;
      } else {
        record.distance = distance || 0;
        record.time = time || 0;
      }

      groupedHistory[name].push(record);
    });

    return res.status(200).json({
      success: true,
      history: Object.values(groupedHistory).flat(),
    });
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching exercise history.",
    });
  }
};

export const getHistoryByEmailUser = async (req, res) => {
  try {
    // Use req.query for GET requests
    const { email, name } = req.query;

    // Input validation with specific error messages
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name parameter is required",
      });
    }

    // Execute query directly with the provided parameters
    const history = await ExerciseHistory.find({
      email,
      name,
    }).select("-_id -__v");

    // Return successful response
    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching exercise history:", error);

    // Provide more specific error handling
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid parameter format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching exercise history",
    });
  }
};

export const getMarcos = async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const data = await UserMarcos.findOne({ email });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const user = await User.findOne({ email });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDailyMacrosAggregate = async (req, res) => {
  const { email, date } = req.query;
  
  // Validate query parameters
  if (!email || !date) {
    return res.status(400).json({
      success: false,
      message: "Missing email or date in query parameters.",
    });
  }
  
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Meal.aggregate([
      {
        $match: {
          email,
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$totalMacros.calories" },
          totalProtein: { $sum: "$totalMacros.protein" },
          totalCarbs: { $sum: "$totalMacros.carbs" },
          totalFat: { $sum: "$totalMacros.fat" },
        },
      },
    ]);

    res.json(
      result[0] || {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNutrition = async (req, res) => {
  try {
    const nutritionData = [];

    // Correct path to the .xlsx file (no need for './data' twice)
    const filePath = path.join(__dirname, '..', 'data', 'nutrition.xlsx'); // Adjust path to point to the correct file

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Assuming the data is in the first sheet
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet data into JSON, using the first row as headers
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Assuming the first row contains headers and starting from row 2 for data
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];

      // Check if the row has data
      if (row[0] && row[2] && row[38] && row[57] && row[69]) {
        nutritionData.push({
          food: row[1], // Column 0: Food
          calories: row[2], // Column 2: Calories
          protein: row[38], // Column 38: Protein
          carbs: row[57], // Column 57: Carbs
          fat: row[69], // Column 69: Fat
        });
      }
    }

    // Return the nutrition data as a response
    res.status(200).json({
      nutritionData
    });
  } catch (error) {
    // Handle errors if something goes wrong
    res.status(500).json({
      success: false,
      message: "Error reading the .xlsx file: " + error.message,
    });
  }
};