import React, { useEffect, useState } from "react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { ScatterChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import axios from 'axios';

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
  const [data, setData] = useState(null); // Initial state as null
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pan`);
        setData(response.data); // Save data directly
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
    console.log(data)

  const containerId = "ageGroupChart";
  const getMonth = new Date().getMonth() + 1; // getMonth() returns 0 for January, so add 1 to get correct month
  const targetMonth = getMonth.toString().padStart(2, "0"); // Format it as '01', '02', etc.

  // Function to filter and prepare the data
  const processData = (rawData) => {
    const months = [
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
    ];
    const gender = ["Male", "Female"];
    const processedData = rawData.map((entry) => {
      const date = new Date(entry.timestamp);
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month as '01', '02', ...
      const day = date.getDate().toString().padStart(2, "0"); // Day in 'DD' format
      const formattedDate = `2024-${month}-${day}`; // Format as '2024-MM-DD'

      return {
        date: formattedDate,
        age: entry.age,
        gender: entry.gender,
      };
    });

    return processedData.filter((d) => months.includes(d.date.slice(5, 7)));
  };

  const chartData = data ? processData(data.data) : []; // Processed data after API call

  useEffect(() => {
    const chartDom = document.getElementById(containerId);
    if (!chartDom) {
      console.error(`Error: Element with id "${containerId}" not found.`);
      return;
    }

    // Set cursor style to "plus" on the chart container
    chartDom.style.cursor = "crosshair"; // Set cursor to "crosshair" (similar to "plus")

    const myChart = echarts.init(chartDom);

    // Filter the data to include only entries from the target month
    const filteredData = chartData.filter((d) =>
      d.date.startsWith(`2024-${targetMonth}`)
    );

    // Extract data for Male and Female, and sort them by date
    const femaleData = filteredData
      .filter((d) => d.gender === "Female")
      .map(({ date, age }) => [date, age])
      .sort((a, b) => a[0].localeCompare(b[0])); // Sort by date

    const maleData = filteredData
      .filter((d) => d.gender === "Male")
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
    const femaleAvgData = uniqueDates.map((date) => [date, femaleAvg]);
    const maleAvgData = uniqueDates.map((date) => [date, maleAvg]);

    // Chart Options
    const option = {
      title: {
        text: `${data?.disease_name} Analysis: Age Group vs. Time`,
        left: "center",
        textStyle: {
          color: "#333",
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      grid: {
        left: "15%", // Adjust to give space for the Y-axis label
        right: "10%",
        bottom: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          return `Gender: ${params.seriesName}<br>Date: ${params.data[0]}<br>Age: ${params.data[1]}`;
        },
      },
      legend: {
        top: "4%",
        data: ["Female", "Male"],
        textStyle: {
          color: "#555",
        },
        itemGap: 15,
      },

      xAxis: {
        type: "category",
        nameLocation: "middle",
        nameTextStyle: {
          color: "#444",
          fontSize: 14,
          fontWeight: "bold",
        },
        axisLabel: {
          color: "#666",
          fontSize: 12,
          rotate: 45, // Rotates the label for better visibility
        },
        axisTick: {
          alignWithLabel: true,
        },
        nameGap: 30,
        data: uniqueDates,
      },
      yAxis: {
        type: "value",
        name: "Age",
        nameLocation: "middle", // Place label in the middle of the axis
        nameRotate: 90, // Rotate the label vertically
        nameTextStyle: {
          color: "#444",
          fontSize: 14,
          fontWeight: "bold",
        },
        nameGap: 50, // Space between the Y-axis and its label
        axisLabel: {
          color: "#666",
          fontSize: 12,
        },
        splitNumber: 5,
      },
      series: [
        {
          name: "Female",
          type: "scatter",
          data: femaleData,
          itemStyle: {
            color: "#ff7f50",
          },
          symbolSize: 8,
        },
        {
          name: "Male",
          type: "scatter",
          data: maleData,
          itemStyle: {
            color: "#4682b4",
          },
          symbolSize: 8,
        },
        {
          name: "Female Average",
          type: "line",
          data: femaleAvgData,
          symbol: "none",
          lineStyle: {
            color: "#ff7f50",
            type: "dashed",
          },
        },
        {
          name: "Male Average",
          type: "line",
          data: maleAvgData,
          symbol: "none",
          lineStyle: {
            color: "#4682b4",
            type: "dashed",
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  return <div id={containerId} style={{ width: "100%", height: "700px" }} />;
};

export default AgeGroupVsTimeChart;
