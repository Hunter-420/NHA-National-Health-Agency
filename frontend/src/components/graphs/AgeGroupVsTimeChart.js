import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ScatterChart,
  CanvasRenderer,
]);

const AgeGroupVsTimeChart = () => {
  const containerId = 'ageGroupChart';
  const getMonth = new Date().getMonth() + 1; // getMonth() returns 0 for January, so add 1 to get correct month
  const targetMonth = getMonth.toString().padStart(2, '0'); // Format it as '01', '02', etc.

  // Function to generate random data for 100 data points
  const generateRandomData = (numPoints) => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const gender = ['Male', 'Female'];
    const data = [];

    // Generate 100 data points with random months, ages, and genders
    for (let i = 0; i < numPoints; i++) {
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      const randomDate = Math.floor(Math.random() * 28) + 1; // Random date between 1 and 28
      const randomAge = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Random age between 10 and 100
      const randomGender = gender[Math.floor(Math.random() * gender.length)];
      // Format date as YYYY-MM-DD
      const formattedDate = `2024-${randomMonth}-${randomDate.toString().padStart(2, '0')}`;
      data.push({ date: formattedDate, age: randomAge, gender: randomGender });
    }

    return data;
  };

  const chartData = generateRandomData(3000); // Generate 100 random data points

  useEffect(() => {
    const chartDom = document.getElementById(containerId);
    if (!chartDom) {
      console.error(`Error: Element with id "${containerId}" not found.`);
      return;
    }

    // Set cursor style to "plus" on the chart container
    chartDom.style.cursor = 'crosshair'; // Set cursor to "crosshair" (similar to "plus")

    const myChart = echarts.init(chartDom);

    // Filter the data to include only entries from the target month (January in this case)
    const filteredData = chartData.filter((d) => d.date.startsWith(`2024-${targetMonth}`));

    // Extract data for Male and Female, and sort them by date
    const femaleData = filteredData
      .filter((d) => d.gender === 'Female')
      .map(({ date, age }) => [date, age])
      .sort((a, b) => a[0].localeCompare(b[0])); // Sort by date

    const maleData = filteredData
      .filter((d) => d.gender === 'Male')
      .map(({ date, age }) => [date, age])
      .sort((a, b) => a[0].localeCompare(b[0])); // Sort by date

    // Get unique dates for X-axis
    const uniqueDates = [...new Set(filteredData.map((d) => d.date))].sort();

    // Calculate average for each gender
    const calculateAverage = (data) => {
      if (data.length === 0) return 0;
      const sum = data.reduce((acc, curr) => acc + curr[1], 0);
      return sum / data.length;
    };

    const femaleAvg = calculateAverage(femaleData);
    const maleAvg = calculateAverage(maleData);

    // Create the average data points for each gender based on unique dates
    const femaleAvgData = uniqueDates.map(date => [date, femaleAvg]);
    const maleAvgData = uniqueDates.map(date => [date, maleAvg]);

    // Chart Options
    const option = {
      title: {
        text: 'Corona Analysis: Age Group vs. Time',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '20%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `Gender: ${params.seriesName}<br>Date: ${params.data[0]}<br>Age: ${params.data[1]}`;
        },
      },
      legend: {
        bottom: '5%',
        data: ['Female', 'Male'],
        textStyle: {
          color: '#555',
        },
      },
      xAxis: {
        type: 'category',
        name: 'Date',
        data: uniqueDates, // Use the unique dates for X-axis
        nameTextStyle: {
          color: '#444',
          fontSize: 14,
          fontWeight: 'bold',
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
          rotate: 45, // Rotate labels for better visibility
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Age',
        nameTextStyle: {
          color: '#444',
          fontSize: 14,
          fontWeight: 'bold',
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
        splitNumber: 5,
      },
      series: [
        {
          name: 'Female',
          type: 'scatter',
          data: femaleData,
          itemStyle: {
            color: '#ff7f50',
          },
          symbolSize: 8,
        },
        {
          name: 'Male',
          type: 'scatter',
          data: maleData,
          itemStyle: {
            color: '#4682b4',
          },
          symbolSize: 8,
        },
        {
          name: 'Female Average',
          type: 'line',
          data: femaleAvgData,
          symbol: 'none',
          lineStyle: {
            color: '#ff7f50',
            type: 'dashed',
          },
        },
        {
          name: 'Male Average',
          type: 'line',
          data: maleAvgData,
          symbol: 'none',
          lineStyle: {
            color: '#4682b4',
            type: 'dashed',
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  return <div id={containerId} style={{ width: '100%', height: '700px' }} />;
};

export default AgeGroupVsTimeChart;
