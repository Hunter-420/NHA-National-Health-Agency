import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CanvasJSReact from '@canvasjs/react-charts';
import { useNavigate } from 'react-router-dom';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MonthlyDiseaseChart = () => {
  const [data, setData] = useState(null); // Initial state as null
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const lineColors = ["#FF6347", "#32CD32", "#FFD700"]; // Colors for the lines
  const daysOfWeek = ["week1", "week2", "week3", "week4"]; // Assuming 4 weeks for each disease

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/trend/get-monthly-case`);
        setData(response.data); // Save data directly
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle clicking on a line (disease)
  const handleLineClick = (diseaseName) => {
    navigate(`/province/${diseaseName}`);
  };

  // Conditional rendering: Handle loading, error, and chart display
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available.</div>;
  }

  // Transform data into the format required for the chart
  const diseaseData = data.map((item, index) => {
    const weeklyCountsArray = Object.values(item.weekly_counts).map((count) => parseInt(count)); // Convert string to number
    return {
      disease_name: item.disease_name || `Disease ${index + 1}`,
      dataPoints: weeklyCountsArray.map((count, idx) => ({
        y: count,
        label: daysOfWeek[idx],
      })),
    };
  });

  const options = {
    animationEnabled: true,
    backgroundColor: "#2256CC",
    title: {
      text: "Disease Analysis in Nepal",
      fontColor: "#00FFFF",
    },
    axisY: {
      labelFontColor: "white",
      gridThickness: 0,
    },
    axisX: {
      labelFontColor: "white",
      interval: 1,
    },
    toolTip: {
      shared: true,
      contentFormatter: function (e) {
        let content = `<strong>${e.entries[0].dataPoint.label}</strong><br>`;
        e.entries.forEach((entry) => {
          content += `<strong>${entry.dataSeries.name}</strong>: ${entry.dataPoint.y} patients<br>`;
        });
        return content;
      },
    },
    legend: {
      fontColor: "white",
    },
    data: diseaseData.map((disease, index) => ({
      type: "spline",
      name: disease.disease_name,
      showInLegend: true,
      color: lineColors[index % lineColors.length],
      lineThickness: 3,
      dataPoints: disease.dataPoints,
      click: () => handleLineClick(disease.disease_name), // Handle click on the line
    })),
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default MonthlyDiseaseChart;
