import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Plus, Minus, Replace, Trash, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExerciseSelector from "@/components/ExerciseSelector";
import ExerciseHistory from "@/components/exerciseHistory";

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById, finishWorkout, user, createWorkoutHistory, exerciseHistory, getExerciseHistory, getExerciseHistoryUserName, addPosts } = useAuthStore();
  const [trackingData, setTrackingData] = useState({});
  const [removedDefaultSets, setRemovedDefaultSets] = useState({});
  const [localExercises, setLocalExercises] = useState([]);
  const [replacementTarget, setReplacementTarget] = useState(null);
  const [exerciseSelectorVisible, setExerciseSelectorVisible] = useState(false);
  const [historyVisibility, setHistoryVisibility] = useState({});
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [post, setPost] = useState(false);
  const [activity, setActivity] = useState("");
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

  useEffect(() => {
    if (user && user.email) {
      getExerciseHistory(user.email);
    }
  }, [user, exerciseHistory, getExerciseHistory]);

  const workoutType = workouts?.type;
  const workoutTItle = workouts?.title;

  const exercises = localExercises;

  // Define the handleAddExercise function
  const handleAddExercise = (newExerciseData) => {
    setLocalExercises((prevExercises) => [
      ...prevExercises,
      newExerciseData
    ]);
    setExerciseSelectorVisible(false); // Hide the ExerciseSelector after adding exercise
  };

  const calculateDuration = () => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
  
      const durationInMinutes = (end - start) / 1000 / 60;
      return durationInMinutes >= 0 ? durationInMinutes : 0; 
    }
    return 0;
  };
  
  

  // Updates input values for default sets, additional sets, and cardio fields
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
    // Calculate duration based on workout type
    const duration = workoutType === "weights" ? calculateDuration() : (workoutType === "cardio" ? trackingData[exercises[0]._id]?.time || 0 : 0);
  
    const results = exercises.map((exercise) => {
      const exerciseData = trackingData[exercise._id] || {};
      const visibleSetsCount = getVisibleSetsCount(exercise);
      const sets = [];
  
      // Collect default sets
      for (let i = 0; i < visibleSetsCount; i++) {
        sets.push({
          reps: exerciseData.sets?.[i]?.reps || 0,
          weight: exerciseData.sets?.[i]?.weight || 0,
        });
      }
  
      // Collect additional sets
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
          distance: exerciseData.distance ?? 0,
          time: exerciseData.time ?? 0, // Cardio time is part of the exercise data
        }),
      };
    });
  
    // Ensure the distance and time values for cardio
    const distanceValue = workoutType === "cardio" ? (results[0]?.distance || 0) : 0;
    const timeValue = workoutType === "cardio" ? (results[0]?.time || 1) : 1; // Prevent division by 0
    const paceValue = workoutType === "cardio" ? timeValue / distanceValue : null;
  
    // Format the post data
    const formattedPostData = {
      name: user?.name || "Default Name",
      type: workoutType,
      activity: activity || "Unknown Activity",
      title: workoutTItle || "Untitled Workout",
      duration: duration, // Set the calculated duration here
      pace: workoutType === "cardio" ? paceValue : undefined,
      distance: workoutType === "cardio" ? distanceValue : undefined,
      description: workoutDescription || "No description provided",
      exercises: workoutType === "weights" ? results : [],
    };
  
    console.log("📤 Posting Data:", formattedPostData);
  
    try {
      // Always call these functions
      await finishWorkout(user.email, workoutType, results);
      await createWorkoutHistory(user.email, workoutTItle, workoutType);
  
      // Only post if "post" is checked
      if (post) {
        await addPosts(
          formattedPostData.name,
          formattedPostData.type,
          formattedPostData.activity,
          formattedPostData.title,
          formattedPostData.duration,
          formattedPostData.pace ?? null, 
          formattedPostData.distance ?? null, 
          formattedPostData.description,
          formattedPostData.exercises
        );
      }
  
      alert("Workout completed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error completing workout:", error);
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

  // Handle removal of an exercise
  const handleRemoveExercise = (exerciseId) => {
    setLocalExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise._id !== exerciseId)
    );
    setTrackingData((prev) => {
      const newTrackingData = { ...prev };
      delete newTrackingData[exerciseId];
      return newTrackingData;
    });
  };

  const toggleHistory = (exerciseId) => {
    setHistoryVisibility((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {exercises.length > 0 ? (
        <div className="bg-white shadow rounded p-6">
          {workoutType === "weights" &&        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <label htmlFor="startTime" className="block text-lg font-medium mb-2">
              Start Time:
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="endTime" className="block text-lg font-medium mb-2">
              End Time:
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>}
          <h2 className="text-2xl font-bold mb-4">Workout Exercises</h2>
          <div className="mt-4">
            <label htmlFor="activity" className="block text-lg font-medium text-gray-700">
              Activity
            </label>
            <input
              type="text"
              id="activity"
              className="mt-2 p-2 border rounded-md w-full"
              placeholder="Enter activity name..."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>

          {exercises.map((exercise, index) => (
            <div key={exercise._id || index} className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{exercise.name}</p>
                {workoutType === "weights" && (
                  <div className="flex space-x-2">
                    <ChartBar
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() => toggleHistory(exercise._id)}
                    />
                    <Replace
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() =>
                        setReplacementTarget((prev) =>
                          prev?.index === index ? null : { index, oldExercise: exercise }
                        )
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
                    <Trash
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() => handleRemoveExercise(exercise._id)} // Remove exercise
                    />
                  </div>
                )}
              </div>

              {workoutType === "weights" ? (
                <>
                  <div className="flex justify-between card text-gray-700 text-sm font-medium mt-2 mb-1">
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
                          placeholder={exercise.reps || "Reps"}
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
                            placeholder={exercise.reps || "Reps"}
                          />
                        </div>
                      ))}
                  </div>
                  <div>
                    {historyVisibility[exercise._id] && <ExerciseHistory exerciseName={exercise.name} />}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex justify-end">
                    <ChartBar
                      className="w-5 h-5 text-cyan-600 cursor-pointer hover:text-cyan-800"
                      onClick={() => toggleHistory(exercise._id)}
                    />
                  </div>
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
                  <div>
                    {historyVisibility[exercise._id] && <ExerciseHistory exerciseName={exercise.name} />}
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

          <div className="flex justify-center items-center">
            <button
              className="bg-cyan-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-700 transition"
              onClick={() => setExerciseSelectorVisible(!exerciseSelectorVisible)}
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
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                id="postCheckbox"
                onChange={() => { setPost(!post) }}
              />
              <span className="text-gray-800 font-medium">Post</span>
            </label>
          </div>

          <div className="mt-4">
            <label htmlFor="workoutDescription" className="block text-lg font-medium text-gray-700">
              Workout Description
            </label>
            <textarea
              id="workoutDescription"
              className="mt-2 p-2 border rounded-md w-full"
              rows="4"
              placeholder="Describe your workout..."
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              required
            />


            <button
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
              onClick={handleFinishWorkout}
            >
              Finish
            </button>
          </div>
        </div>
      ) : (
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
