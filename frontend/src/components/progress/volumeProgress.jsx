import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const VolumeProgress = ({ data, showDropdown = true }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  const filteredData = data.filter((item) => item.sets); // Exclude cardio exercises (no sets)
  const exerciseNames = Array.from(new Set(filteredData.map((item) => item.name)));

  // Default selected exercise to the first available exercise
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0]);

  useEffect(() => {
    if (exerciseNames.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseNames[0]);
    }
  }, [exerciseNames, selectedExercise]);

  // Filter sessions based on selected exercise
  const filteredSessions = filteredData.filter(
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
  const chartData = {
    labels: sessionVolumes.map((entry) => entry.date),
    datasets: [
      {
        type: "line", // Line chart type
        label: "Volume per Session (Weight × Reps)",
        data: sessionVolumes.map((entry) => entry.totalVolume),
        borderColor: "rgba(54, 162, 235, 0.7)", // Line color
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Line fill color
        fill: true, // Filling the area under the line
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
    animation: {
      duration: 300, // Set animation duration to 300ms for quicker transitions
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {showDropdown && (
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
      )}

      {filteredSessions.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No chart data available for {selectedExercise}</p>
      )}
    </div>
  );
};

export default VolumeProgress;
