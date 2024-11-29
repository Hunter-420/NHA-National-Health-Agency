import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is imported

const SpecificDiseaseProvinceBarChart = () => {
  const { diseaseName } = useParams(); // Get disease name from the URL
  const navigate = useNavigate(); // Get navigate function
  const [data, setData] = useState(null); // Initial state as null
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const [chartData, setChartData] = useState({
    labels: [], // Will be populated dynamically
    datasets: [
      {
        label: 'No. of Admitted Patients',
        data: [], // Will be populated dynamically
        backgroundColor: [], // Colors set dynamically
        barPercentage: 0.7,
        borderRadius: 8,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/trend/get-disease-detail-province/${diseaseName}`);
        setData(response.data); // Save data directly
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [diseaseName]);

  useEffect(() => {
    if (data) {
      // Filter out the 'NULL' province
      const filteredData = Object.entries(data.weekly_counts).filter(([province]) => province !== 'NULL');
      
      const provinces = filteredData.map(([province]) => province); // Get the filtered province names
      const counts = filteredData.map(([, count]) => count); // Get the counts for each province

      // Calculate highest and lowest values
      const max = Math.max(...counts);
      const min = Math.min(...counts);

      // Assign colors based on conditions
      const colors = counts.map((value) =>
        value === max ? 'rgba(255, 0, 0, 0.8)' : value === min ? 'rgba(0, 128, 0, 0.8)' : 'rgba(0, 123, 255, 0.8)'
      );

      setChartData({
        labels: provinces, // Use filtered province names as labels
        datasets: [
          {
            label: `No. of Admitted Patients for ${diseaseName}`,
            data: counts,
            backgroundColor: colors,
            barPercentage: 0.7,
            borderRadius: 8,
          },
        ],
      });
    }
  }, [data, diseaseName]);

  // Function to handle click on a bar
  const handleBarClick = (event) => {
    const chart = event.chart;
    const activePoints = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true);

    if (activePoints.length > 0) {
      const clickedIndex = activePoints[0].index;
      let provinceName = chartData.labels[clickedIndex];
      provinceName = provinceName.replace(/\s+/g, '').toLowerCase();

      navigate(`/province/${provinceName}/${diseaseName}`);
    }
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Patients: ${context.raw}`,
        },
      },
      title: {
        display: true,
        text: `Number of Admitted Patients for ${diseaseName}`,
        font: {
          size: 18,
        },
        color: '#333',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          boxWidth: 20,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Provinces of Nepal',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#444',
        },
        grid: {
          display: false, // Disable grid lines on the x-axis
          drawBorder: false, // Remove the vertical line at the edge after the last bar
        },
      },
      y: {
        title: {
          display: true,
          text: 'No. of Admitted Patients',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#444',
          stepSize: 50,
        },
        grid: {
          display: true, // Keep grid lines for the y-axis
          drawBorder: false, // Don't draw border on the y-axis
        },
      },
    },
    onClick: handleBarClick, // Attach the click handler to the chart
  };
  

  return (
    <div style={{ width: '100%', height: '450px' }}>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error fetching data: {error.message}</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{ display: 'inline-block', marginRight: '15px' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'rgba(255, 0, 0, 0.8)', marginRight: '5px' }}></span>
          Highest-Affected Province
        </div>
        <div style={{ display: 'inline-block', marginRight: '15px' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'rgba(0, 128, 0, 0.8)', marginRight: '5px' }}></span>
          Lowest-Affected Province
        </div>
        <div style={{ display: 'inline-block' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'rgba(0, 123, 255, 0.8)', marginRight: '5px' }}></span>
          Moderately Affected Provinces
        </div>
      </div>
    </div>
  );
};

export default SpecificDiseaseProvinceBarChart;
