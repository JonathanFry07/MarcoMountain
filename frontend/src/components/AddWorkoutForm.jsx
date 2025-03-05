import React, { useState } from "react";
import { Dumbbell, Heart, DiamondPlus } from "lucide-react";
import ExerciseSelector from "./ExerciseSelector";

const AddWorkoutForm = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("weights");
    const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("title:", title, "type:", type);
        onClose();
    };

    const addExercise = (e) => {
        e.preventDefault();
        setExerciseSelectorVisible(!exerciseSelectorVisible);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 outline outline-cyan-500">
            {/* Modal content */}
            <div className="relative bg-white p-6 rounded shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
                {/* Icon in top-right corner */}
                <div className="absolute top-3 right-3 text-gray-600">
                    {type === "cardio" ? (
                        <Heart className="h-3 w-3 mr-1 text-cyan-500" />
                    ) : (
                        <Dumbbell className="h-3 w-3 mr-1 text-cyan-500" />
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Title and Type on the same row */}
                    <div className="mb-4 flex space-x-4">
                        <div className="w-7/10">
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Workout Title"
                                required
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-cyan-500 hover:ring-2 hover:ring-cyan-500"
                            />
                        </div>
                        <div className="w-3/10">
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-cyan-500 hover:ring-2 hover:ring-cyan-500"
                            >
                                <option value="weights">Weights</option>
                                <option value="cardio">Cardio</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex justify-end">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-gray-400"
                            onClick={addExercise}
                        >
                            Add Exercise
                            <DiamondPlus className="ml-2" />
                        </button>
                    </div>

                    {/* Render ExerciseSelector if button is clicked */}
                    {exerciseSelectorVisible && (
                        <div className="mb-4">
                            <ExerciseSelector selectedType={type} />
                        </div>
                    )}

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
