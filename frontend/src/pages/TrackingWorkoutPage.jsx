import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById, finishWorkout, user } = useAuthStore();
  const [trackingData, setTrackingData] = useState({});
  const [removedDefaultSets, setRemovedDefaultSets] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getWorkoutById(id);
    }
  }, [id]);

  const workoutType = workouts?.type;
  const exercises = workouts?.workouts || [];

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    // For cardio exercises with distance field
    if (field === "distance") {
      // Only set distance to 5 if the input is empty
      const numericValue = value === "" ? "" : Math.max(0, parseFloat(value) || ""); 
      
      setTrackingData((prev) => ({
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] || {}),
          distance: numericValue // Keep distance as input value or empty
        }
      }));
      return;
    }

    // For weight training (existing code)
    const numericValue = Math.max(0, parseInt(value, 10) || "");

    setTrackingData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      const exercise = exercises.find((e) => e._id === exerciseId);
      const originalSets = exercise?.sets || 0;

      // Ensure sets is always initialized as an array
      if (!exerciseData.sets) {
        exerciseData.sets = [];
      }

      if (setIndex < originalSets) {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            sets: {
              ...(exerciseData.sets || {}),
              [setIndex]: {
                ...(exerciseData.sets?.[setIndex] || {}),
                [field]: numericValue,
              },
            },
          },
        };
      }

      const additionalSets = exerciseData.additionalSets || [];
      const additionalIndex = setIndex - originalSets;
      const updatedAdditionalSets = [...additionalSets];

      if (!updatedAdditionalSets[additionalIndex]) {
        updatedAdditionalSets[additionalIndex] = { weight: "", reps: "" }; // Initialize with empty strings
      }

      updatedAdditionalSets[additionalIndex][field] = value === "" ? "" : numericValue;

      return {
        ...prev,
        [exerciseId]: {
          ...exerciseData,
          additionalSets: updatedAdditionalSets,
        },
      };
    });
  };

  const handleAddSet = (exerciseId) => {
    setTrackingData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseData,
          additionalSets: [
            ...(exerciseData.additionalSets || []),
            { weight: "", reps: "" }, // Add new set with empty strings
          ],
        },
      };
    });
  };

  const handleRemoveSet = (exerciseId) => {
    const exercise = exercises.find((e) => e._id === exerciseId);
    if (!exercise) return;

    setTrackingData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      const originalSets = exercise.sets || 0;
      const additionalSets = exerciseData.additionalSets || [];

      if (additionalSets.length > 0) {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            additionalSets: additionalSets.slice(0, -1),
          },
        };
      }

      const currentSets = originalSets + (additionalSets?.length || 0);
      if (currentSets > 0) {
        setRemovedDefaultSets((prev) => ({
          ...prev,
          [exerciseId]: (prev[exerciseId] || 0) + 1,
        }));
      }

      return prev;
    });
  };

  const getVisibleSetsCount = (exercise) => {
    const originalSets = exercise.sets || 0;
    const removed = removedDefaultSets[exercise._id] || 0;
    return Math.max(0, originalSets - removed);
  };

  const handleFinishWorkout = async () => {
    // Prepare the results in the required format
    const results = exercises.map((exercise) => {
      const exerciseData = trackingData[exercise._id] || {};
      const visibleSetsCount = getVisibleSetsCount(exercise);
      const sets = [];

      // Add default sets that are visible
      for (let i = 0; i < visibleSetsCount; i++) {
        sets.push({
          reps: exerciseData.sets?.[i]?.reps || 0,
          weight: exerciseData.sets?.[i]?.weight || 0
        });
      }

      // Add additional sets
      if (exerciseData.additionalSets && exerciseData.additionalSets.length > 0) {
        exerciseData.additionalSets.forEach(set => {
          sets.push({
            reps: set.reps || 0,
            weight: set.weight || 0
          });
        });
      }

      // For cardio exercises, include distance
      return {
        name: exercise.name,
        sets: sets,
        ...(workoutType === "cardio" && { distance: exerciseData.distance !== undefined ? exerciseData.distance : 0 })
      };
    });

    // Only send the results array as the payload
    const payload = results;

    // Save the workout type in a variable before calling finishWorkout
    const type = workoutType;

    try {
      const email = user.email;
      console.log("email: ", email);
      await finishWorkout(email, type, payload);
      alert("Workout completed successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error completing workout.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {exercises.length > 0 ? (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Workout Exercises</h2>
          {exercises.map((exercise, index) => (
            <div key={exercise._id || index} className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{exercise.name}</p>
                {workoutType === "weights" && (
                  <div className="flex space-x-2">
                    <Minus
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => handleRemoveSet(exercise._id)}
                    />
                    <Plus
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
                      onClick={() => handleAddSet(exercise._id)}
                    />
                  </div>
                )}
              </div>

              {workoutType === "weights" ? (
                <>
                  <div className="flex justify-between text-gray-700 text-sm font-medium mt-2 mb-1">
                    <span>Set</span>
                    <span>Weight (kg)</span>
                    <span>Reps</span>
                  </div>
                  <div className="space-y-2">
                    {[...Array(getVisibleSetsCount(exercise))].map((_, setIndex) => (
                      <div key={setIndex} className="flex justify-between items-center space-x-2">
                        <span className="text-gray-600 w-8">{setIndex + 1}</span>
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-20 text-center"
                          value={trackingData[exercise._id]?.sets?.[setIndex]?.weight || ""}
                          onChange={(e) =>
                            handleInputChange(exercise._id, setIndex, "weight", e.target.value)
                          }
                          min="0"
                        />
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-16 text-center"
                          value={trackingData[exercise._id]?.sets?.[setIndex]?.reps || ""}
                          onChange={(e) =>
                            handleInputChange(exercise._id, setIndex, "reps", e.target.value)
                          }
                          min="0"
                        />
                      </div>
                    ))}

                    {trackingData[exercise._id]?.additionalSets?.map((set, idx) => {
                      const setNumber = getVisibleSetsCount(exercise) + idx + 1;
                      return (
                        <div key={`add-${idx}`} className="flex justify-between items-center space-x-2">
                          <span className="text-gray-600 w-8">{setNumber}</span>
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-20 text-center"
                            value={set.weight || ""} // Display empty value instead of "0"
                            onChange={(e) =>
                              handleInputChange(exercise._id, setNumber - 1, "weight", e.target.value)
                            }
                            min="0"
                          />
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-16 text-center"
                            value={set.reps || ""} // Display empty value instead of "0"
                            onChange={(e) =>
                              handleInputChange(exercise._id, setNumber - 1, "reps", e.target.value)
                            }
                            min="0"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-gray-700 text-sm font-medium mt-2 mb-1">
                    <span>Distance (km)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center space-x-2">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-full text-center"
                        value={trackingData[exercise._id]?.distance || ""}
                        onChange={(e) =>
                          handleInputChange(exercise._id, 0, "distance", e.target.value)
                        }
                        min="0"
                      />
                    </div>
                  </div>
                </>
              )}

              {index !== exercises.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}

          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">
              Save
            </button>
            <button
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
              onClick={handleFinishWorkout}
            >
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
