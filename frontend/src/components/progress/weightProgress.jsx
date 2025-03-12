import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Sample API response with workout history
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

const WeightProgress = () => {
  const filteredHistory = apiResponse.history.filter((item) => item.sets);
  const exerciseNames = Array.from(new Set(filteredHistory.map((item) => item.name)));
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0]);

  // Filter sessions for the selected exercise
  const filteredSessions = filteredHistory.filter(
    (session) => session.name === selectedExercise
  );

  // Create one x-axis label per session using just the date
  const xLabels = filteredSessions.map((session) =>
    format(new Date(session.dateCompleted), "MMM dd")
  );

  // Determine the maximum number of sets across all sessions
  const maxSets = Math.max(...filteredSessions.map((s) => s.sets.length));

  // Define colors for differentiating sets
  const datasetColors = [
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
  ];

  // Build one dataset per set index so that each session contributes a weight for that set (or null if not available)
  const datasets = [];
  for (let i = 0; i < maxSets; i++) {
    const dataForSet = filteredSessions.map((session) =>
      session.sets[i] ? session.sets[i].weight : null
    );
    datasets.push({
      label: `Set ${i + 1}`,
      data: dataForSet,
      backgroundColor: datasetColors[i % datasetColors.length],
      borderColor: datasetColors[i % datasetColors.length].replace("0.5", "1"),
      borderWidth: 1,
    });
  }

  const data = {
    labels: xLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Workout Sessions" } },
      y: { title: { display: true, text: "Weight (kg)" }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        className="w-full sm:w-[180px] p-2 border rounded mb-4"
      >
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {filteredSessions.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p>No chart data available for {selectedExercise}</p>
      )}
    </div>
  );
};

export default WeightProgress;
