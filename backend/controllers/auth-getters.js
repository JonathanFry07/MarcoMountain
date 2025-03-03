import Workout from "../model/workout.js";
import Exercise from "../model/exercise.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();

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

export const getExercises = async (req, res) => {
    try {
      const exercises = await Exercise.find();
  
      const filteredExercises = exercises.map(exercise => {
        const { name, type, description, bodyPart } = exercise._doc;
        const result = { name, type, description };
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
  