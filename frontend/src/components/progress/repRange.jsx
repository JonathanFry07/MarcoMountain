import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Filler);

const RepRangeAnalysis = ({ data = [], showDropdown = true }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    if (!selectedExercise && data.length > 0) {
      const exercisesWithoutCardio = data.filter((exercise) => !exercise.distance);
      const exerciseNames = Array.from(new Set(exercisesWithoutCardio.map((item) => item.name)));
      if (exerciseNames.length > 0) {
        setSelectedExercise(exerciseNames[0]);
      }
    }
  }, [data, selectedExercise]);

  if (!data || data.length === 0 || !selectedExercise) {
    return <div>Loading chart...</div>;
  }

  const exercisesWithoutCardio = data.filter((exercise) => !exercise.distance);
  const exerciseNames = Array.from(new Set(exercisesWithoutCardio.map((item) => item.name)));
  const filteredSessions = exercisesWithoutCardio.filter(
    (session) => session.name === selectedExercise
  );

  const xLabels = filteredSessions.map((session) =>
    new Date(session.dateCompleted).toLocaleDateString()
  );

  const maxSets = Math.max(...filteredSessions.map((s) => s.sets ? s.sets.length : 0));

  const datasetColors = [
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 205, 86, 0.5)",
  ];

  const datasets = [];
  for (let i = 0; i < maxSets; i++) {
    const dataForSet = filteredSessions.map((session) =>
      session.sets && session.sets[i] ? session.sets[i].reps : null
    );
    datasets.push({
      label: `Set ${i + 1}`,
      data: dataForSet,
      backgroundColor: datasetColors[i % datasetColors.length],
      borderColor: datasetColors[i % datasetColors.length].replace("0.5", "1"),
      borderWidth: 1,
      fill: true,
    });
  }

  const chartData = {
    labels: xLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
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
    animation: {
      duration: 300,
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium">Reps per Set</h3>
        {showDropdown && exerciseNames.length > 0 && selectedExercise && (
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
        )}
      </div>
      {!selectedExercise ? (
        <div>Loading chart...</div>
      ) : filteredSessions.length === 0 ? (
        <div>No sets data available for the selected exercise.</div>
      ) : (
        <div className="h-[180px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default RepRangeAnalysis;
