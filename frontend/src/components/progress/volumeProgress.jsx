import React, { useState } from "react";
import { Line } from "react-chartjs-2"; // Importing Line chart
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement, // Register point element for line chart
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,  // Point element to render points in a line chart
  Tooltip,
  Legend
);

// Sample API response
const apiResponse = {
  success: true,
  history: [
    {
      name: "Bench Press",
      dateCompleted: "2025-03-11T15:47:40.163Z",
      sets: [
        { reps: 4, weight: 60 },
        { reps: 4, weight: 60 },
        { reps: 3, weight: 60 },
      ],
    },
    {
      name: "Bench Press",
      dateCompleted: "2025-03-11T18:48:10.270Z",
      sets: [
        { reps: 4, weight: 60 },
        { reps: 4, weight: 60 },
        { reps: 4, weight: 70 },
      ],
    },
    {
      name: "Incline Bench Press",
      dateCompleted: "2025-03-11T15:47:40.199Z",
      sets: [
        { reps: 8, weight: 50 },
        { reps: 8, weight: 50 },
        { reps: 7, weight: 50 },
      ],
    },
  ],
};

// VolumeProgress component for displaying volume charts
const VolumeProgress = () => {
  const filteredHistory = apiResponse.history.filter((item) => item.sets);
  const exerciseNames = Array.from(new Set(filteredHistory.map((item) => item.name)));
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0]);

  // Filter sessions based on selected exercise
  const filteredSessions = filteredHistory.filter(
    (session) => session.name === selectedExercise
  );

  // Calculate the volume per session for the selected exercise
  const sessionVolumes = filteredSessions.map((session) => {
    const totalVolume = session.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
    const date = format(new Date(session.dateCompleted), "MMM dd, HH:mm");
    return {
      date,
      totalVolume,
    };
  });

  // Dataset for volume graph
  const data = {
    labels: sessionVolumes.map((entry) => entry.date),
    datasets: [
      {
        type: "line",  // Line chart type
        label: "Volume per Session (Weight × Reps)",
        data: sessionVolumes.map((entry) => entry.totalVolume),
        borderColor: "rgba(54, 162, 235, 0.7)",  // Line color
        backgroundColor: "rgba(54, 162, 235, 0.2)",  // Line fill color
        fill: true,  // Filling the area under the line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: {
      x: { title: { display: true, text: "Workout Sessions" } },
      y: { title: { display: true, text: "Volume (Weight × Reps)" }, beginAtZero: true },
    },
  };

  return (
    <div>
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
      >
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {/* Render the chart for the selected exercise */}
      <div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default VolumeProgress;
