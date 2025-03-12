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

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RepRangeAnalysis = () => {
  const [selectedExercise, setSelectedExercise] = useState("Bench Press");

  // Hardcoded history data with unique timestamps
  const history = [
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
  ];

  // Get unique exercise names for the dropdown
  const exerciseNames = Array.from(new Set(history.map((item) => item.name)));

  // Filter sessions for the selected exercise
  const filteredSessions = history.filter(
    (session) => session.name === selectedExercise
  );

  // Create one x-axis label per session (using just the date)
  const xLabels = filteredSessions.map((session) =>
    new Date(session.dateCompleted).toLocaleDateString()
  );

  // Determine the maximum number of sets across all sessions
  const maxSets = Math.max(...filteredSessions.map((s) => s.sets.length));

  // Define some colors to differentiate sets
  const datasetColors = [
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
  ];

  // Build a dataset for each set index (e.g., Set 1, Set 2, etc.)
  const datasets = [];
  for (let i = 0; i < maxSets; i++) {
    // For each session, if there is a set at index i, use its reps; otherwise null.
    const dataForSet = filteredSessions.map((session) =>
      session.sets[i] ? session.sets[i].reps : null
    );
    datasets.push({
      label: `Set ${i + 1}`,
      data: dataForSet,
      backgroundColor: datasetColors[i % datasetColors.length],
      borderColor: datasetColors[i % datasetColors.length].replace("0.5", "1"),
      borderWidth: 1,
    });
  }

  const chartData = {
    labels: xLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      // Hide legend if you prefer no keys, or set display to true if needed
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: "Workout Session Date" },
      },
      y: {
        title: { display: true, text: "Reps" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Dropdown for exercise selection */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between pb-2">
        <h3 className="text-lg font-medium">Reps per Set</h3>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full sm:w-[180px] p-2 border rounded"
        >
          {exerciseNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* Render grouped bar chart */}
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RepRangeAnalysis;
