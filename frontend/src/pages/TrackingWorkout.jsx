import React from "react";
import { useParams } from "react-router-dom";

const TrackingWorkout = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <p className="text-xl font-medium text-gray-800">Workout ID: {id}</p>
    </div>
  );
};

export default TrackingWorkout;
