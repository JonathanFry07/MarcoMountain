import React, { useState, useEffect, useMemo } from "react";
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

const PaceAnalysis = ({ data, showDropdown = true }) => {
  const [chartData, setChartData] = useState(null);
  const [paceData, setPaceData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(""); // State for selected exercise

  // Extract unique exercise names from data (filtering out weight-based exercises)
  const exercises = useMemo(() => {
    const uniqueExercises = Array.from(
      new Set(data.filter((session) => session.distance && session.time).map((session) => session.name))
    );
    return uniqueExercises;
  }, [data]);

  // Set default exercise when data loads
  useEffect(() => {
    if (exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(exercises[0]); // Set first available exercise
    }
  }, [exercises, selectedExercise]);

  useEffect(() => {
    if (data && data.length > 0 && selectedExercise) {
      // Filter out sessions with missing distance, time, or that do not match the selected exercise
      const filteredSessions = data.filter(
        (session) => session.distance && session.time && session.name === selectedExercise
      );

      // Create the pace data for the selected exercise
      const paceData = filteredSessions.map((session) => {
        const pacePerKm = session.time / session.distance; // Calculate pace (minutes per km)
        const formattedDate = format(new Date(session.dateCompleted), "MMM dd, yyyy");

        return {
          date: formattedDate,
          pace: pacePerKm, // pace in minutes per km
          time: session.time, // Time spent for the session
        };
      });

      setPaceData(paceData);

      // Set the chart data state
      setChartData({
        labels: paceData.map((entry) => entry.date),
        datasets: [
          {
            type: "line", // Line chart type
            label: "Average Pace (Minutes per Kilometer)",
            data: paceData.map((entry) => entry.pace),
            borderColor: "rgba(54, 162, 235, 1)", // Line color
            backgroundColor: "rgba(54, 162, 235, 0.2)", // Line fill color
            fill: true,  // Filling the area under the line
            tension: 0.3, // Adding smoothness to the line
            pointRadius: 3, // Reduce the size of data points
            borderWidth: 2, // Thicker line for better visibility
          },
        ],
      });
    }
  }, [data, selectedExercise]); // Re-run when data or selectedExercise changes

  // Memoize chart data and options to improve performance
  const memoizedChartData = useMemo(() => chartData, [chartData]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            // Get the index of the data point
            const index = tooltipItem.dataIndex;
            const pace = tooltipItem.raw; // Pace for the line
            const time = paceData[index]?.time; // Time for the session from paceData

            // Return a custom tooltip with pace and time
            return `Pace: ${pace.toFixed(2)} min/km, Time: ${time} min`;
          },
        },
      },
    },
    animation: {
      duration: 100, // Reduce animation duration for faster rendering
      easing: 'easeOutQuad', // Choose a faster easing function
    },
    scales: {
      x: {
        title: { display: true, text: "Workout Sessions" },
      },
      y: {
        title: { display: true, text: "Pace (Minutes per Kilometer)" },
        beginAtZero: true,
      },
    },
  }), [chartData, paceData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Conditional Dropdown to select exercise */}
      {showDropdown && (
        <div className="mb-4">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full sm:w-[180px] p-2 border rounded"
          >
            {exercises.length === 0 ? (
              <option value="">No exercises available</option>
            ) : (
              exercises.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* Render the chart if there's data */}
      <div className="grid gap-4 md:grid-cols-2">
        {memoizedChartData ? (
          <Line data={memoizedChartData} options={options} />
        ) : (
          <p>No pace data available.</p>
        )}
      </div>
    </div>
  );
};

export default PaceAnalysis;
