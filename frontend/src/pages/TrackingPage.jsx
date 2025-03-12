import React, { useState } from "react";
import { Utensils, Dumbbell, CalendarDays, ChartNetwork } from "lucide-react";
import WorkoutSelection from "@/components/WorkoutSelection"; 
import { useNavigate } from "react-router-dom";

const TrackingPage = () => {
  // State to control the visibility of WorkoutSelection
  const [showWorkoutSelection, setShowWorkoutSelection] = useState(false);
  const navigate = useNavigate();

  const handleTrackExerciseClick = () => {
    setShowWorkoutSelection(true); // Show WorkoutSelection when the button is clicked
  };

  const handleCloseWorkoutSelection = () => {
    setShowWorkoutSelection(false); // Hide WorkoutSelection when its back button is clicked
  };

  const handleClick = () => {
    navigate("/recent-activity");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start overflow-hidden relative">
      <div className="space-y-4 max-w-xs mx-auto w-full pt-12">
        {/* Calories Tracking Button */}
        <button
          className="w-full bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={() => console.log("Navigate to calorie tracking")}
        >
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <Utensils className="h-5 w-5 text-teal-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">Track Calories</h2>
            <p className="text-sm text-gray-600">Log your meals and snacks</p>
          </div>
        </button>

        {/* Exercise Tracking Button */}
        <button
          className="w-full bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={handleTrackExerciseClick}
        >
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
            <Dumbbell className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">Track Exercise</h2>
            <p className="text-sm text-gray-600">Record your workouts</p>
          </div>
        </button>

        {/* View recent activity Button */}
        <button
          className="w-full bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={handleClick}
        >
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
            <CalendarDays className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">View Recent activity</h2>
            <p className="text-sm text-gray-600">See your activity log</p>
          </div>
        </button>

        <button
          className="w-full bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
          onClick={() => {
            navigate("/progress");
          }}
        >
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
            <ChartNetwork className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">View Workout Analysis</h2>
            <p className="text-sm text-gray-600">See your progress</p>
          </div>
        </button>

        {/* Conditionally render the floating WorkoutSelection modal */}
        {showWorkoutSelection && (
          <div className="fixed inset-x-0 top-16 z-50 p-4 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <WorkoutSelection onClose={handleCloseWorkoutSelection} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
