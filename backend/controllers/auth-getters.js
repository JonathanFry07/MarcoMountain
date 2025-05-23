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
import Posts from "../model/posts.js";
import Comment from "../model/comments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getWorkouts = async (req, res) => {
  const { email } = req.params;
  try {
    const workouts = await Workout.find({ email });
    
    const formattedWorkouts = workouts.map((workout) => workout.toObject());
    
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

    // Fetch meals for the given email and date
    const meals = await Meal.find({
      email,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).select("-__v -_id");

    // Aggregate total macros
    const macrosResult = await Meal.aggregate([
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

    const macros = macrosResult[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    };

    res.json({ meals, macros });
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
    const filePath = path.join(__dirname, '..', 'data', 'macro_nutrients_p2.xlsx');

    const workbook = xlsx.readFile(filePath);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet data into JSON as an array of arrays (each row is an array)
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Loop through the rows starting from index 1 (skip the header row)
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      
      // Only include rows that have a food name (assumed to be in column 0)
      if (!row[0]) continue;

      nutritionData.push({
        food: row[0],
        calories: row[4] || 0,  // Assuming calories are in column 4
        carbs: row[5] || 0,     // Assuming carbs are in column 5
        fat: row[6] || 0,       // Assuming fat is in column 6
        protein: row[7] || 0    // Assuming protein is in column 7
      });
    }

    res.status(200).json({ nutritionData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error reading the .xlsx file: " + error.message,
    });
  }
};

export const getMealsForPage = async (req, res) => {
  try {
    const meals = await Meal.find({
      $and: [
        { "ingredients.0": { $exists: true } },
        { "preparationSteps.0": { $exists: true } }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Meals fetched successfully",
      meals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find(); // Fetch all posts from DB

    res.status(200).json({
      success: true,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const getKudos = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId).select("kudosGivenBy -_id");

    res.status(200).json({
      success: true,
      kudosGivenBy: post.kudosGivenBy 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const postNutrition = async (req, res) => {
  try {
    const { food, calories, carbs, fat, protein } = req.body;

    // Validate required fields
    if (!food || calories === undefined || carbs === undefined || 
        fat === undefined || protein === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: food, calories, carbs, fat, protein" 
      });
    }

    // Convert to numbers and validate
    const caloriesNum = Number(calories);
    const carbsNum = Number(carbs);
    const fatNum = Number(fat);
    const proteinNum = Number(protein);
    
    if ([caloriesNum, carbsNum, fatNum, proteinNum].some(isNaN)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid numeric values for calories, carbs, fat, or protein" 
      });
    }

    // Define file path
    const filePath = path.resolve(__dirname, '..', 'data', 'macro_nutrients_p2.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Check if food already exists
    const foodExists = sheetData.some(row => row[0]?.toLowerCase() === food.toLowerCase());

    if (foodExists) {
      return res.status(200).json({
        success: true,  // Change to true so frontend knows request was handled
        exists: true,   // Additional flag for frontend to differentiate cases
        message: `Food item "${food}" already exists in the sheet.`
      });
    }

    // Append new data
    const numColumns = sheetData[0].length;
    const newRow = new Array(numColumns).fill('');
    newRow[0] = food;          
    newRow[4] = caloriesNum;  
    newRow[5] = carbsNum;  
    newRow[6] = fatNum;  
    newRow[7] = proteinNum;  
    sheetData.push(newRow);

    // Update worksheet
    const updatedWorksheet = xlsx.utils.aoa_to_sheet(sheetData);
    workbook.Sheets[sheetName] = updatedWorksheet;
    xlsx.writeFile(workbook, filePath);

    res.status(201).json({ 
      success: true, 
      exists: false, // Additional flag for clarity
      message: "Nutrition entry added successfully",
      newEntry: { food, calories: caloriesNum, carbs: carbsNum, fat: fatNum, protein: proteinNum }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating spreadsheet: " + error.message,
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ success: false, message: "postId is required" });
  }
  try {
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .select('createdAt name comment'); 

    const commentsCount = await Comment.countDocuments({ post: postId });

    res.status(200).json({ success: true, comments, commentsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching comments: " + error.message });
  }
};