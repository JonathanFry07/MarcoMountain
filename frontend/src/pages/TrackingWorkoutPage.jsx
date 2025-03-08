import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus, Minus } from "lucide-react"; // Import Plus and Minus icons

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById } = useAuthStore();
  const [setsData, setSetsData] = useState({});
  const [removedDefaultSets, setRemovedDefaultSets] = useState({});

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

    setSetsData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      
      // For default sets
      if (setIndex < (exercises.find(e => e._id === exerciseId)?.sets || 0)) {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            sets: {
              ...(exerciseData.sets || {}),
              [setIndex]: {
                ...(exerciseData.sets?.[setIndex] || {}),
                [field]: numericValue
              }
            }
          }
        };
      }
      
      // For additional sets
      const additionalSets = exerciseData.additionalSets || [];
      const additionalIndex = setIndex - (exercises.find(e => e._id === exerciseId)?.sets || 0);
      
      const updatedAdditionalSets = [...additionalSets];
      if (!updatedAdditionalSets[additionalIndex]) {
        updatedAdditionalSets[additionalIndex] = { weight: 0, reps: 0 };
      }
      
      updatedAdditionalSets[additionalIndex] = {
        ...updatedAdditionalSets[additionalIndex],
        [field]: numericValue
      };
      
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseData,
          additionalSets: updatedAdditionalSets
        }
      };
    });
  };

  const handleAddSet = (exerciseId) => {
    setSetsData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      const additionalSets = exerciseData.additionalSets || [];
      
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseData,
          additionalSets: [
            ...additionalSets,
            { weight: 0, reps: 0 } // Add just one new set
          ]
        }
      };
    });
  };

  const handleRemoveSet = (exerciseId) => {
    const exercise = exercises.find(e => e._id === exerciseId);
    if (!exercise) return;
    
    const originalSets = exercise.sets || 0;
    const removed = removedDefaultSets[exerciseId] || 0;
    const additionalSets = setsData[exerciseId]?.additionalSets || [];
    
    // If there are additional sets, remove the last one first
    if (additionalSets.length > 0) {
      setSetsData((prev) => {
        const exerciseData = prev[exerciseId] || {};
        const updatedAdditionalSets = additionalSets.slice(0, -1);
        
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            additionalSets: updatedAdditionalSets
          }
        };
      });
    }
    // If no additional sets but we still have default sets, mark one as removed
    else if (originalSets - removed > 0) {
      setRemovedDefaultSets(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    }
  };

  const getVisibleSetsCount = (exercise) => {
    if (!exercise || !exercise._id) return 0;
    const originalSets = exercise.sets || 0;
    const removed = removedDefaultSets[exercise._id] || 0;
    return Math.max(0, originalSets - removed);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {exercises.length > 0 ? (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Workout Exercises</h2>
          {exercises.map((exercise, index) => {
            const visibleSetsCount = getVisibleSetsCount(exercise);
            
            return (
              <div key={exercise._id || index} className="mb-6">
                {/* Exercise Title + Plus/Minus Icons */}
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">{exercise.name}</p>
                  <div className="flex space-x-2">
                    <Minus
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                      onClick={() => handleRemoveSet(exercise._id)}
                    />
                    <Plus
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                      onClick={() => handleAddSet(exercise._id)}
                    />
                  </div>
                </div>

                {/* Header Row for Weight & Reps */}
                <div className="flex justify-between text-gray-700 text-sm font-medium mt-2 mb-1">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                </div>

                {/* Inputs for weight & reps per set */}
                <div className="space-y-2">
                  {/* Default sets (only the visible ones) */}
                  {[...Array(visibleSetsCount)].map((_, setIndex) => (
                    <div key={setIndex} className="flex justify-between items-center space-x-2">
                      <span className="text-gray-600 w-8">{setIndex + 1}</span>

                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20 text-center"
                        min="0"
                        value={setsData[exercise._id]?.sets?.[setIndex]?.weight || ""}
                        onChange={(e) =>
                          handleInputChange(exercise._id, setIndex, "weight", e.target.value)
                        }
                        placeholder="0"
                      />

                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-16 text-center"
                        min="0"
                        value={setsData[exercise._id]?.sets?.[setIndex]?.reps || ""}
                        onChange={(e) =>
                          handleInputChange(exercise._id, setIndex, "reps", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}

                  {/* Additional Sets */}
                  {setsData[exercise._id]?.additionalSets?.map((set, idx) => {
                    const setNumber = visibleSetsCount + idx + 1;
                    return (
                      <div key={`additional-${idx}`} className="flex justify-between items-center space-x-2">
                        <span className="text-gray-600 w-8">{setNumber}</span>

                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-20 text-center"
                          min="0"
                          value={set.weight || ""}
                          onChange={(e) =>
                            handleInputChange(exercise._id, setNumber - 1, "weight", e.target.value)
                          }
                          placeholder="0"
                        />

                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-16 text-center"
                          min="0"
                          value={set.reps || ""}
                          onChange={(e) =>
                            handleInputChange(exercise._id, setNumber - 1, "reps", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                    );
                  })}
                </div>

                {index !== exercises.length - 1 && <hr className="my-4 border-gray-300" />}
              </div>
            );
          })}

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