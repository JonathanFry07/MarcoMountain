import React, { useState, useEffect } from "react";
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

const WeightProgress = ({ data }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  const filteredData = data.filter((item) => item.sets); // Filter out cardio exercises (without sets)
  const exerciseNames = Array.from(new Set(filteredData.map((item) => item.name)));

  // Default selected exercise to the first available exercise
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0]);

  useEffect(() => {
    // If the exerciseNames array is not empty, set the default exercise on mount
    if (exerciseNames.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseNames[0]);
    }
  }, [exerciseNames, selectedExercise]);

  const filteredSessions = filteredData.filter(
    (session) => session.name === selectedExercise
  );

  const xLabels = filteredSessions.map((session) =>
    format(new Date(session.dateCompleted), "MMM dd")
  );

  const maxSets = Math.max(...filteredSessions.map((s) => s.sets.length));

  const datasetColors = [
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(255, 205, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
  ];

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

  const chartData = {
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
    animation: {
      duration: 300, // Set animation duration to 300ms for quicker transitions
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
        <Bar data={chartData} options={options} />
      ) : (
        <p>No chart data available for {selectedExercise}</p>
      )}
    </div>
  );
};

export default WeightProgress;
