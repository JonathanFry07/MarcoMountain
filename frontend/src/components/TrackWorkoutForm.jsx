import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore"; // Import the store

const TrackWorkoutForm = ({ workoutId, onClose }) => {
  const { workouts, getWorkoutById, exercises, getExercises, getWorkouts } = useAuthStore();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState([]); // Store exercises with names

  useEffect(() => {
    if (workoutId) {
      getWorkoutById(workoutId); // Fetch the workout details based on workoutId
    }
  }, [workoutId, getWorkoutById]);

  useEffect(() => {
    getExercises(); // Fetch the exercises list
    console.log("exercises: ", exercises);
  }, [exercises, getExercises]);

  useEffect(() => {
    if (workouts && workouts.length > 0 && exercises.length > 0) {
      const workout = workouts[0]; // Assume first workout
      setSelectedWorkout(workout);
  
      const exercisesWithNames = workout.exercises.map((exercise) => {
        const exerciseDetails = exercises.find((ex) => ex.id === exercise.exerciseId);
  
        const setsDetails = Array.from({ length: exercise.sets }, () => ({
          repsCompleted: "",
          weight: "",
        }));
  
        return {
          ...exercise,
          name: exerciseDetails ? exerciseDetails.name : "Unknown Exercise",
          setsDetails,
        };
      });
  
      setExerciseDetails(exercisesWithNames);
    }
  }, [workouts, exercises, workoutId]);
  

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exerciseDetails];

    // Make sure we're updating only the specific set
    updatedExercises[exerciseIndex].setsDetails = updatedExercises[exerciseIndex].setsDetails.map((set, i) =>
      i === setIndex ? { ...set, [field]: value } : set
    );

    setExerciseDetails(updatedExercises);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Workout Data:", exerciseDetails); // Log the workout data (you can send it to an API or elsewhere)
    onClose(); // Close the form after submission
  };

  if (!selectedWorkout || exerciseDetails.length === 0) {
    return <div>Loading...</div>; // Show loading state while fetching workout/exercises
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40 pointer-events-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()} // Close modal on outside click
    >
      <div
        className="relative bg-white p-6 rounded shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-4">Track Your Workout</h2>

          {/* Render inputs for each exercise */}
          {exerciseDetails.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="mb-4 p-4 border-b border-gray-300">
              <div className="text-lg font-semibold">{exercise.name}</div>
              <div>
                Target Sets: {exercise.sets}, Target Reps: {exercise.reps}
              </div>

              {/* Render input fields for each set */}
              {exercise.setsDetails.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center space-x-4 mb-2">
                  <div>Set {setIndex + 1}:</div>
                  <input
                    type="number"
                    value={set.repsCompleted}
                    onChange={(e) =>
                      handleSetChange(exerciseIndex, setIndex, "repsCompleted", e.target.value)
                    }
                    placeholder="Reps Completed"
                    className="w-20 border border-gray-300 rounded p-2"
                    required
                  />
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) =>
                      handleSetChange(exerciseIndex, setIndex, "weight", e.target.value)
                    }
                    placeholder="Weight (kg)"
                    className="w-20 border border-gray-300 rounded p-2"
                    required
                  />
                </div>
              ))}
            </div>
          ))}

          {/* Submit and Cancel buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-blue-600">
              Submit Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackWorkoutForm;
