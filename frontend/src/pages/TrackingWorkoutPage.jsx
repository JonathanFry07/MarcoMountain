import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus } from "lucide-react"; // Import Plus icon

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById } = useAuthStore();
  const [setsData, setSetsData] = useState({});

  useEffect(() => {
    if (id) {
      getWorkoutById(id);
    }
  }, [id]);

  const exercises =
    workouts && workouts.workouts && workouts.workouts.length > 0
      ? workouts.workouts
      : [];

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    // Ensure the value is non-negative
    const numericValue = Math.max(0, parseInt(value, 10) || 0);

    setSetsData((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setIndex]: {
          ...prev[exerciseId]?.[setIndex],
          [field]: numericValue,
        },
      },
    }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {exercises.length > 0 ? (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Workout Exercises</h2>
          {exercises.map((exercise, index) => (
            <div key={exercise._id || index} className="mb-6">
              {/* Exercise Title + Plus Icon */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{exercise.name}</p>
                <Plus
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                  onClick={() => console.log(`Add set for ${exercise.name}`)}
                />
              </div>

              {/* Header Row for Weight & Reps */}
              <div className="flex justify-between text-gray-700 text-sm font-medium mt-2 mb-1">
                <span>Set</span>
                <span>Weight (kg)</span>
                <span>Reps</span>
              </div>

              {/* Inputs for weight & reps per set */}
              <div className="space-y-2">
                {[...Array(exercise.sets)].map((_, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex justify-between items-center space-x-2"
                  >
                    <span className="text-gray-600 w-8"> {setIndex + 1} </span>

                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-20 text-center"
                      min="0"
                      value={setsData[exercise._id]?.[setIndex]?.weight || ""}
                      onChange={(e) =>
                        handleInputChange(
                          exercise._id,
                          setIndex,
                          "weight",
                          e.target.value
                        )
                      }
                      placeholder="0"
                    />

                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-16 text-center"
                      min="0"
                      value={setsData[exercise._id]?.[setIndex]?.reps || ""}
                      onChange={(e) =>
                        handleInputChange(
                          exercise._id,
                          setIndex,
                          "reps",
                          e.target.value
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {index !== exercises.length - 1 && (
                <hr className="my-4 border-gray-300" />
              )}
            </div>
          ))}

          {/* Save & Finish Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition">
              Save
            </button>
            <button className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">
              Finish
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading workout data...</p>
      )}
    </div>
  );
};

export default TrackingWorkoutPage;
