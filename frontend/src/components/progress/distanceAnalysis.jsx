import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2"; // Importing Bar chart
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const DistanceAnalysis = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Filter out sessions with missing distance
      const filteredSessions = data.filter((session) => session.distance && session.time);

      // Create the distance data
      const distanceData = filteredSessions.map((session) => {
        const formattedDate = format(new Date(session.dateCompleted), "MMM dd, yyyy");

        return {
          date: formattedDate,
          distance: session.distance, // Distance in km
          time: session.time, // Time in minutes (for tooltip)
        };
      });

      // Set the chart data state
      setChartData({
        labels: distanceData.map((entry) => entry.date),
        datasets: [
          {
            type: "bar", // Bar chart type
            label: "Distance (km)",
            data: distanceData.map((entry) => entry.distance),
            backgroundColor: "rgba(54, 162, 235, 0.7)", // Bar color
            borderColor: "rgba(54, 162, 235, 1)", // Border color for bars
            borderWidth: 1, // Border width for bars
            timeData: distanceData.map((entry) => entry.time), // Store time data for each session
          },
        ],
      });
    }
  }, [data]);

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
            const distance = tooltipItem.raw; // Distance for the bar
            const time = chartData?.datasets[0]?.timeData[index]; // Correctly access time from timeData array

            // Return a custom tooltip with distance and time
            return `Distance: ${distance} km, Time: ${time} min`;
          },
        },
      },
    },
    animation: {
      duration: 0, // Disable animation entirely for faster rendering
    },
    scales: {
      x: {
        title: { display: true, text: "Workout Sessions" },
      },
      y: {
        title: { display: true, text: "Distance (km)" },
        beginAtZero: true,
      },
    },
  }), [chartData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        {memoizedChartData ? (
          <Bar data={memoizedChartData} options={options} />
        ) : (
          <p>Loading distance data...</p>
        )}
      </div>
    </div>
  );
};

export default DistanceAnalysis;
