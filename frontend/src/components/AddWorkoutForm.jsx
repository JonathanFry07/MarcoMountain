import React, { useState } from "react"
import { Dumbbell, Heart, DiamondPlus, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react"
import ExerciseSelector from "./ExerciseSelector"
import { useAuthStore } from "@/store/authStore"

const AddWorkoutForm = ({ onClose }) => {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("weights") // This determines the workout type
  const [exercises, setExercises] = useState([])
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null)

  const { createWorkout, getWorkouts, user } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Exercises:", exercises)

    if (!title.trim()) {
      console.error("Error: Workout title is required.")
      return
    }

    if (exercises.length === 0) {
      console.error("Error: At least one exercise must be added.")
      return
    }

    try {
      const result = await createWorkout(title, type, exercises, user.email)
      console.log("Workout created successfully:", result)
      getWorkouts(user.email)
      onClose()
    } catch (error) {
      console.error("Error creating workout:", error)
    }
  }

  // Use the parent's type to decide which fields to include.
  const addExercise = (exercise) => {
    if (editingExerciseIndex !== null) {
      // If we're editing, replace the exercise at that index
      const orderedExercise = {
        exerciseId: exercise.id, // Preserve exercise ID
        name: exercise.name,
        ...(type === "cardio"
          ? { distance: Number(exercise.distance) } // Use distance for cardio workouts
          : {
              sets: Number(exercise.sets), // Use sets and reps for weights
              reps: Number(exercise.reps),
            }),
      }

      const updatedExercises = [...exercises]
      updatedExercises[editingExerciseIndex] = orderedExercise
      setExercises(updatedExercises)
      setEditingExerciseIndex(null)
    } else {
      // Add a new exercise
      const orderedExercise = {
        exerciseId: exercise.id, // Preserve exercise ID
        name: exercise.name,
        ...(type === "cardio"
          ? { distance: Number(exercise.distance) } // Use distance for cardio workouts
          : {
              sets: Number(exercise.sets), // Use sets and reps for weights
              reps: Number(exercise.reps),
            }),
      }
      setExercises([...exercises, orderedExercise])
    }
    setExerciseSelectorVisible(false) // Close exercise selector after adding
  }

  // Function to remove an exercise from the list
  const removeExercise = (index) => {
    const updatedExercises = [...exercises]
    updatedExercises.splice(index, 1)
    setExercises(updatedExercises)
  }

  // Function to start editing an exercise
  const startEditExercise = (index) => {
    setEditingExerciseIndex(index)
    setExerciseSelectorVisible(true)
  }

  // Function to move an exercise up in the list
  const moveExerciseUp = (index) => {
    if (index === 0) return // Already at the top
    const updatedExercises = [...exercises]
    const temp = updatedExercises[index]
    updatedExercises[index] = updatedExercises[index - 1]
    updatedExercises[index - 1] = temp
    setExercises(updatedExercises)
  }

  // Function to move an exercise down in the list
  const moveExerciseDown = (index) => {
    if (index === exercises.length - 1) return // Already at the bottom
    const updatedExercises = [...exercises]
    const temp = updatedExercises[index]
    updatedExercises[index] = updatedExercises[index + 1]
    updatedExercises[index + 1] = temp
    setExercises(updatedExercises)
  }

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
              onClick={() => {
                setEditingExerciseIndex(null) // Ensure we're adding, not editing
                setExerciseSelectorVisible(true)
              }}
            >
              Add Exercise <DiamondPlus className="ml-2" />
            </button>
          </div>
          {exerciseSelectorVisible && (
            <div>
              {editingExerciseIndex !== null && (
                <div className="mb-2 bg-blue-50 p-2 rounded text-sm flex items-center">
                  <span className="font-medium">Editing:</span>
                  <span className="ml-1">{exercises[editingExerciseIndex].name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExerciseIndex(null)
                      setExerciseSelectorVisible(false)
                    }}
                    className="ml-auto text-gray-600 hover:text-gray-800"
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
              <ExerciseSelector
                selectedType={type}
                onAddExercise={addExercise}
                initialValues={editingExerciseIndex !== null ? exercises[editingExerciseIndex] : null}
              />
            </div>
          )}
          <ul className="mb-4">
            {exercises.map((ex, index) => (
              <li key={index} className="p-2 border-b border-gray-300 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex flex-col mr-2">
                    <button
                      type="button"
                      onClick={() => moveExerciseUp(index)}
                      disabled={index === 0}
                      className={`text-gray-500 hover:text-gray-700 p-0.5 ${
                        index === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      aria-label="Move exercise up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveExerciseDown(index)}
                      disabled={index === exercises.length - 1}
                      className={`text-gray-500 hover:text-gray-700 p-0.5 ${
                        index === exercises.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                      }`}
                      aria-label="Move exercise down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <span>
                    {ex.name} ({type === "cardio" ? `${ex.distance} km` : `${ex.sets} sets, ${ex.reps} reps`})
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => startEditExercise(index)}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                    aria-label="Edit exercise"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-cyan-500 hover:text-cyan-700 p-1 rounded-full hover:bg-red-100"
                    aria-label="Remove exercise"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-blue-600">
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWorkoutForm

