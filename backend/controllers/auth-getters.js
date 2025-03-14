import Workout from "../model/workout.js";
import Exercise from "../model/exercise.js";
import WorkoutHistory from "../model/workoutHistory.js";
import CustomExercise from "../model/customExercise.js";
import ExerciseHistory from "../model/exerciseHistory.js";

export const getWorkouts = async (req, res) => {
  const { email } = req.params;
  try {
    const workouts = await Workout.find({email});

    const exerciseIds = new Set();
    workouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        exerciseIds.add(ex.exerciseId);
      });
    });

    const exercises = await Exercise.find({ id: { $in: Array.from(exerciseIds) } });
    
    const exerciseMap = {};
    exercises.forEach(ex => {
      exerciseMap[ex.id] = ex.name;
    });

    const formattedWorkouts = workouts.map(workout => {
      const workoutObj = workout.toObject();
      workoutObj.exercises = workoutObj.exercises.map(ex => ({
        ...ex,
        name: exerciseMap[ex.exerciseId] || "Unknown"
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
    const workouts= await Workout.findOne({id});

    const exerciseIds = new Set();
    for (let i = 0; i < workouts.length; i++) {
      for (let j = 0; j < workouts[i].exercises.length; j++) {
        exerciseIds.add(workouts[i].exercises[j].exerciseId);
      }
    }
    
    const exercises = await Exercise.find({ id: { $in: Array.from(exerciseIds) } });
    
    const exerciseMap = {};
    exercises.forEach(ex => {
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
  
      const filteredExercises = exercises.map(exercise => {
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
      const exercises = await CustomExercise.find({email});
  
      const filteredExercises = exercises.map(exercise => {
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
      const histories = await WorkoutHistory.find({ email }).select("-_id -__v");;
  
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
  const { email,  name } = req.body; // Get the name from the request body

  if (!email && !name) {
    return res.status(400).json({
      success: false,
      message: "Missing required parameter",
    });
  }

  try {
    const history = await ExerciseHistory.find({email, name}).select("-_id -__v");

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching exercise history.",
    });
  }
};

  