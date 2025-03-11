import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus, Minus, Replace, Trash2 } from "lucide-react";
import ExerciseSelector from "@/components/ExerciseSelector";

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById, finishWorkout, user, createWorkoutHistory } = useAuthStore();
  const [trackingData, setTrackingData] = useState({});
  const [removedDefaultSets, setRemovedDefaultSets] = useState({});
  const [localExercises, setLocalExercises] = useState([]);
  const [replacementTarget, setReplacementTarget] = useState(null);
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getWorkoutById(id);
    }
  }, [id]);

  useEffect(() => {
    if (workouts && workouts.workouts) {
      setLocalExercises(workouts.workouts);
    }
  }, [workouts]);

  const workoutType = workouts?.type;
  const workoutTitle = workouts?.title;
  const exercises = localExercises;

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
      if (additionalSets.length > 0) {
        return {
          ...prev,
          [exerciseId]: {
            ...exerciseData,
            additionalSets: additionalSets.slice(0, -1),
          },
        };
      }
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
      for (let i = 0; i < visibleSetsCount; i++) {
        sets.push({
          reps: exerciseData.sets?.[i]?.reps || 0,
          weight: exerciseData.sets?.[i]?.weight || 0,
        });
      }
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
      const resultHistory = await createWorkoutHistory(user.email, workoutTitle, workoutType);
      console.log("history created", resultHistory);
      alert("Workout completed successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error completing workout.");
    }
  };

  const handleReplaceExercise = (newExerciseData) => {
    if (replacementTarget) {
      const { index, oldExercise } = replacementTarget;
      const updatedExercise = {
        ...newExerciseData,
        _id: newExerciseData.id,
        sets: oldExercise.sets,
      };

      setLocalExercises((prev) => {
        const newExercises = [...prev];
        newExercises[index] = updatedExercise;
        return newExercises;
      });

      setTrackingData((prev) => {
        const newTrackingData = { ...prev };
        if (newTrackingData[oldExercise._id]) {
          newTrackingData[newExerciseData.id] = newTrackingData[oldExercise._id];
          delete newTrackingData[oldExercise._id];
        }
        return newTrackingData;
      });

      setReplacementTarget(null);
    }
  };

  const handleAddExercise = (newExerciseData) => {
    const newExercise = {
      ...newExerciseData,
      _id: newExerciseData.id,
      sets: newExerciseData.sets || 0,
    };
    setLocalExercises((prev) => [...prev, newExercise]);
    setExerciseSelectorVisible(false);
  };

  const handleRemoveExercise = (exerciseId) => {
    setLocalExercises((prev) => prev.filter((exercise) => exercise._id !== exerciseId));
    setTrackingData((prev) => {
      const newData = { ...prev };
      delete newData[exerciseId];
      return newData;
    });
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
                <div className="flex space-x-2">
                  {workoutType === "weights" && (
                    <>
                      <Replace
                        className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                        onClick={() => setReplacementTarget({ index, oldExercise: exercise })}
                      />
                      <Minus
                        className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                        onClick={() => handleRemoveSet(exercise._id)}
                      />
                      <Plus
                        className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                        onClick={() => handleAddSet(exercise._id)}
                      />
                    </>
                  )}
                  <Trash2
                    className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                    onClick={() => handleRemoveExercise(exercise._id)}
                  />
                </div>
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
                          placeholder={exercise.reps || "Reps"}
                        />
                      </div>
                    ))}
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
                            placeholder={exercise.reps || "Reps"}
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

              {replacementTarget && replacementTarget.index === index && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                  <ExerciseSelector
                    selectedType={workoutType === "weights" ? "weights" : "cardio"}
                    onAddExercise={handleReplaceExercise}
                  />
                </div>
              )}

              {index !== exercises.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}

          <div className="flex justify-center items-center">
            <button
              className="bg-cyan-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-700 transition"
              onClick={() => setExerciseSelectorVisible(true)}
            >
              Add Exercise
            </button>
          </div>

          {exerciseSelectorVisible && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <ExerciseSelector
                selectedType={workoutType === "weights" ? "weights" : "cardio"}
                onAddExercise={handleAddExercise}
              />
            </div>
          )}

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
        // Blank page if no exercises (removed h-screen)
        <div className="bg-white shadow rounded p-6 flex flex-col justify-center items-center">
          <button
            className="bg-cyan-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-700 transition"
            onClick={() => setExerciseSelectorVisible(true)}
          >
            Add Exercise
          </button>

          {exerciseSelectorVisible && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <ExerciseSelector
                selectedType={workoutType === "weights" ? "weights" : "cardio"}
                onAddExercise={handleAddExercise}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingWorkoutPage;
