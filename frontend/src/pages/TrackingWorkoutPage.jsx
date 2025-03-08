import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus, Minus, Replace } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExerciseSelector from "@/components/ExerciseSelector";

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById, finishWorkout, user } = useAuthStore();
  const [trackingData, setTrackingData] = useState({});
  const [removedDefaultSets, setRemovedDefaultSets] = useState({});
  // Local copy of exercises so we can update them on replacement.
  const [localExercises, setLocalExercises] = useState([]);
  // Holds the index and current exercise object for which replacement is active.
  const [replacementTarget, setReplacementTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getWorkoutById(id);
    }
  }, [id]);

  // When workouts change, store a local copy of the workouts array.
  useEffect(() => {
    if (workouts && workouts.workouts) {
      setLocalExercises(workouts.workouts);
    }
  }, [workouts]);

  const workoutType = workouts?.type;
  // Use the local exercises array for rendering.
  const exercises = localExercises;

  // Updates input values for default sets, additional sets, and cardio fields.
  const handleInputChange = (exerciseId, setIndex, field, value, isAdditional = false) => {
    const numericValue = value === "" ? "" : Math.max(0, parseFloat(value) || 0);
    setTrackingData((prev) => {
      const exerciseData = prev[exerciseId] || {};
      if (field === "distance" || field === "time") {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            [field]: numericValue,
          },
        };
      } else {
        if (isAdditional) {
          const currentAdditionalSets = exerciseData.additionalSets || [];
          const updatedAdditionalSets = [...currentAdditionalSets];
          if (!updatedAdditionalSets[setIndex]) {
            updatedAdditionalSets[setIndex] = { weight: "", reps: "" };
          }
          updatedAdditionalSets[setIndex][field] = numericValue;
          return {
            ...prev,
            [exerciseId]: {
              ...exerciseData,
              additionalSets: updatedAdditionalSets,
            },
          };
        } else {
          const currentDefaultSets = exerciseData.sets || [];
          const updatedDefaultSets = [...currentDefaultSets];
          if (!updatedDefaultSets[setIndex]) {
            updatedDefaultSets[setIndex] = { weight: "", reps: "" };
          }
          updatedDefaultSets[setIndex][field] = numericValue;
          return {
            ...prev,
            [exerciseId]: {
              ...exerciseData,
              sets: updatedDefaultSets,
            },
          };
        }
      }
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
            { weight: "", reps: "" },
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
      const additionalSets = exerciseData.additionalSets || [];
      // Remove the last additional set if present.
      if (additionalSets.length > 0) {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            additionalSets: additionalSets.slice(0, -1),
          },
        };
      }
      // Otherwise, update the removed count for default sets.
      const currentSets = (exercise.sets || 0) + (additionalSets?.length || 0);
      if (currentSets > 0) {
        setRemovedDefaultSets((prevRemoved) => ({
          ...prevRemoved,
          [exerciseId]: (prevRemoved[exerciseId] || 0) + 1,
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
    const results = exercises.map((exercise) => {
      const exerciseData = trackingData[exercise._id] || {};
      const visibleSetsCount = getVisibleSetsCount(exercise);
      const sets = [];
      // Collect default sets.
      for (let i = 0; i < visibleSetsCount; i++) {
        sets.push({
          reps: exerciseData.sets?.[i]?.reps || 0,
          weight: exerciseData.sets?.[i]?.weight || 0,
        });
      }
      // Collect additional sets.
      if (exerciseData.additionalSets && exerciseData.additionalSets.length > 0) {
        exerciseData.additionalSets.forEach((set) => {
          sets.push({
            reps: set.reps || 0,
            weight: set.weight || 0,
          });
        });
      }
      return {
        name: exercise.name,
        sets: sets,
        ...(workoutType === "cardio" && {
          distance: exerciseData.distance !== undefined ? exerciseData.distance : 0,
          time: exerciseData.time !== undefined ? exerciseData.time : 0,
        }),
      };
    });

    try {
      await finishWorkout(user.email, workoutType, results);
      alert("Workout completed successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error completing workout.");
    }
  };

  // Called when an exercise is selected from ExerciseSelector.
  // It replaces the exercise at the replacement target with the newly picked exercise,
  // preserving the default set count (and associated tracking data).
  const handleReplaceExercise = (newExerciseData) => {
    if (replacementTarget) {
      const { index, oldExercise } = replacementTarget;
      // Build a new exercise object based on the picked exercise,
      // preserving the sets count from the exercise being replaced.
      const updatedExercise = {
        ...newExerciseData,
        _id: newExerciseData.id, // Ensure _id is set for consistency.
        sets: oldExercise.sets,   // Preserve the same number of default sets.
      };

      // Update the local copy of exercises.
      setLocalExercises((prev) => {
        const newExercises = [...prev];
        newExercises[index] = updatedExercise;
        return newExercises;
      });

      // Transfer tracking data from the replaced exercise key to the new one.
      setTrackingData((prev) => {
        const newTrackingData = { ...prev };
        if (newTrackingData[oldExercise._id]) {
          newTrackingData[newExerciseData.id] = newTrackingData[oldExercise._id];
          delete newTrackingData[oldExercise._id];
        }
        return newTrackingData;
      });

      // Close the replacement toggle.
      setReplacementTarget(null);
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
                    <Replace
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() =>
                        setReplacementTarget({ index, oldExercise: exercise })
                      }
                    />
                    <Minus
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() => handleRemoveSet(exercise._id)}
                    />
                    <Plus
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
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
                    {/* Render default set inputs */}
                    {[...Array(getVisibleSetsCount(exercise))].map((_, setIndex) => (
                      <div key={`default-${setIndex}`} className="flex justify-between items-center space-x-2">
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
                    {/* Render additional set inputs */}
                    {trackingData[exercise._id]?.additionalSets &&
                      trackingData[exercise._id].additionalSets.map((set, additionalIndex) => (
                        <div key={`additional-${additionalIndex}`} className="flex justify-between items-center space-x-2">
                          <span className="text-gray-600 w-8">
                            {getVisibleSetsCount(exercise) + additionalIndex + 1}
                          </span>
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-20 text-center"
                            value={set.weight}
                            onChange={(e) =>
                              handleInputChange(
                                exercise._id,
                                additionalIndex,
                                "weight",
                                e.target.value,
                                true
                              )
                            }
                            min="0"
                          />
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-16 text-center"
                            value={set.reps}
                            onChange={(e) =>
                              handleInputChange(
                                exercise._id,
                                additionalIndex,
                                "reps",
                                e.target.value,
                                true
                              )
                            }
                            min="0"
                          />
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-gray-700 text-sm font-medium mt-2 mb-1">
                    <span>Distance (km)</span>
                    <span>Time (minutes)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center space-x-2">
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-1/2 text-center"
                        value={trackingData[exercise._id]?.distance || ""}
                        onChange={(e) =>
                          handleInputChange(exercise._id, 0, "distance", e.target.value)
                        }
                        min="0"
                      />
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-1/2 text-center"
                        value={trackingData[exercise._id]?.time || ""}
                        onChange={(e) =>
                          handleInputChange(exercise._id, 0, "time", e.target.value)
                        }
                        min="0"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* If this exercise is flagged for replacement, show the ExerciseSelector toggle */}
              {replacementTarget && replacementTarget.index === index && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                  <ExerciseSelector 
                    selectedType="weights" 
                    onAddExercise={handleReplaceExercise} 
                  />
                </div>
              )}

              {index !== exercises.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}

          <div className="flex justify-end space-x-4 mt-6">
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
