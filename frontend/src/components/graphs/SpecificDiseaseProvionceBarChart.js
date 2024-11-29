import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useParams } from 'react-router-dom';

const SpecificDiseaseProvinceBarChart = () => {
  const { diseaseName } = useParams(); // Extract disease name from URL
  const [chartData, setChartData] = useState({
    labels: ['Province 1', 'Province 2', 'Province 3', 'Province 4', 'Province 5', 'Province 6', 'Province 7'],
    datasets: [
      {
        label: 'No. of Admitted Patients',
        data: [], // Start with empty data
        backgroundColor: [], // Colors set dynamically
        barPercentage: 0.7,
        borderRadius: 8,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      // Dummy data - Replace this with PostgreSQL integration
      const dummyData = [120, 350, 200, 180, 400, 190, 100];

      // Calculate highest and lowest values
      const max = Math.max(...dummyData);
      const min = Math.min(...dummyData);

      // Assign colors based on conditions
      const colors = dummyData.map((value) =>
        value === max ? 'rgba(255, 0, 0, 0.8)' : value === min ? 'rgba(0, 128, 0, 0.8)' : 'rgba(0, 123, 255, 0.8)'
      );

      setChartData({
        labels: ['Province 1', 'Province 2', 'Province 3', 'Province 4', 'Province 5', 'Province 6', 'Province 7'],
        datasets: [
          {
            label: 'No. of Admitted Patients',
            data: dummyData,
            backgroundColor: colors,
            barPercentage: 0.7,
            borderRadius: 8,
          },
        ],
      });
    };

    fetchData();
  }, []);

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
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <Bar data={chartData} options={options} />
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

