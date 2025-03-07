import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore"; // Assuming this is where user data and workouts are fetched
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ArrowLeftSquare, Asterisk, Dumbbell, Heart } from "lucide-react";

const WorkoutSelection = ({ onClose }) => {
  const { workouts, getWorkouts, user } = useAuthStore();
  const navigate = useNavigate();

  // State for filter selection
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user && user.email) {
      getWorkouts(user.email);
    }
  }, [user, getWorkouts]);

  // Filter workouts based on the selected filter
  const filteredWorkouts = workouts.filter((workout) => {
    if (filter === "all") return true;
    return workout.type === filter;
  });

  const handleTrackClick = (id) => {
    navigate(`/trackingWorkout/${id}`);
  };

  return (
    <div className="relative">
      {/* Header Section with Back Button and Icon-based Filter Buttons */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <ArrowLeftSquare
            onClick={onClose}
            className="h-6 w-6 cursor-pointer text-gray-600 hover:text-cyan-600"
          />
        </div>
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded-md ${
              filter === "all" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            <Asterisk className="h-6 w-6" />
          </button>
          <button
            className={`p-2 rounded-md ${
              filter === "cardio" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("cardio")}
          >
            <Heart className="h-6 w-6" />
          </button>
          <button
            className={`p-2 rounded-md ${
              filter === "weights" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("weights")}
          >
            <Dumbbell className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Fixed Height Scrollable Container for Workout Cards */}
      <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 80px)" }}>
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">{workout.title}</h3>
                  <div
                    className={`text-white text-xs font-medium py-1 px-3 rounded-full ${
                      workout.type === "cardio" ? "bg-teal-500" : "bg-blue-500"
                    }`}
                  >
                    {workout.type === "cardio" ? "Cardio" : "Weights"}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => handleTrackClick(workout.id)}
                  className="mt-4 w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSelection;
