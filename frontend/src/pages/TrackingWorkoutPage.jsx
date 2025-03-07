import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const TrackingWorkoutPage = () => {
  const { id } = useParams();
  const { workouts, getWorkoutById } = useAuthStore();

  useEffect(() => {
    if (id) {
      getWorkoutById(id);
    }
  }, [id]); 

  console.log(workouts);

  return (
    <div>
    </div>
  );
};

export default TrackingWorkoutPage;
