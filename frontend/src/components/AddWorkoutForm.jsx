import React, { useState } from "react";
import { Dumbbell, Heart, DiamondPlus } from "lucide-react";
import ExerciseSelector from "./ExerciseSelector";
import { useAuthStore } from "@/store/authStore";

const AddWorkoutForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("weights"); // This determines the workout type
  const [exercises, setExercises] = useState([]);
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);

  const { createWorkout, getWorkouts } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Exercises:", exercises);

    if (!title.trim()) {
      console.error("Error: Workout title is required.");
      return;
    }

    if (exercises.length === 0) {
      console.error("Error: At least one exercise must be added.");
      return;
    }

    try {
      const result = await createWorkout(title, type, exercises);
      console.log("Workout created successfully:", result);
      getWorkouts();
      onClose();
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  // Use the parent's type to decide which fields to include.
  const addExercise = (exercise) => {
    const orderedExercise = {
      exerciseId: exercise.id, // Preserve exercise ID
      name: exercise.name,
      ...(type === "cardio"
        ? { distance: Number(exercise.distance) } // Use distance for cardio workouts
        : {
            sets: Number(exercise.sets), // Use sets and reps for weights
            reps: Number(exercise.reps),
          }
      ),
    };
    setExercises([...exercises, orderedExercise]);
    setExerciseSelectorVisible(false); // Close exercise selector after adding
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 outline outline-cyan-500">
      <div className="relative bg-white p-6 rounded shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="absolute top-3 right-3 text-gray-600">
          {type === "cardio" ? (
            <Heart className="h-5 w-5 text-cyan-500" />
          ) : (
            <Dumbbell className="h-5 w-5 text-cyan-500" />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workout Title"
              required
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-cyan-500"
            />
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-1/3 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-cyan-500"
            >
              <option value="weights">Weights</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-gray-400"
              onClick={() => setExerciseSelectorVisible(true)}
            >
              Add Exercise <DiamondPlus className="ml-2" />
            </button>
          </div>
          {exerciseSelectorVisible && (
            <ExerciseSelector selectedType={type} onAddExercise={addExercise} />
          )}
          <ul className="mb-4">
            {exercises.map((ex, index) => {
              console.log("Exercise at index", index, ex);
              return (
                <li key={index} className="p-2 border-b border-gray-300">
                  {ex.name} (
                  {type === "cardio"
                    ? `${ex.distance} km`
                    : `${ex.sets} sets, ${ex.reps} reps`}
                  )
                </li>
              );
            })}
          </ul>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-blue-600"
            >
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutForm;
