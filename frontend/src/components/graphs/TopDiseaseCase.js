import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { GridComponent, LegendComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import axios from "axios";

echarts.use([GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const TopDiseaseCase = () => {
      console.log("fasfas")
  const [chartData, setChartData] = useState(null); 
  const chartRef = useRef(null); 
  const [data, setData] = useState(null); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const transformData = (weeklyCounts) => {
    const admitted = [];
    const discharged = [];
    const emergency = [];
    daysOfWeek.forEach((day) => {
      admitted.push(weeklyCounts[day]?.admitted || 0);
      discharged.push(weeklyCounts[day]?.discharged || 0);
      emergency.push(weeklyCounts[day]?.emergency || 0);
    });
    return { admitted, discharged, emergency };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/trend/get-weekly-top-disease-stats`);
        const { weekly_counts, disease_name } = response.data;
        const transformedData = transformData(weekly_counts);
        setChartData(transformedData);
        setData({ disease_name }); // Save disease name separately
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize chart
  const updateChart = () => {
    if (!chartData || !chartRef.current || !data) return;

    const chartDom = chartRef.current;
    const containerWidth = chartDom.offsetWidth;
    const fontSize = Math.max(10, containerWidth / 50);

    const option = {
      title: {
        text: `Top Disease Case - ${data.disease_name}`,
        left: "center",
        top: "10",
        textStyle: {
          fontSize: fontSize * 1.5,
          fontWeight: "bold",
          color: "#000",
        },
      },
      legend: {
        top: 40,
        right: "10%",
        orient: "horizontal",
        data: ["Admitted", "Discharged", "Emergency"],
        textStyle: {
          fontSize: fontSize,
        },
        itemGap: 25,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: 80,
        left: "15%",
        right: "10%",
        bottom: 50,
      },
      xAxis: {
        type: "category",
        data: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        axisLabel: {
          fontSize: fontSize,
        },
      },
      yAxis: {
        type: "value",
        name: `No of ${data.disease_name} Patients`,
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: {
          fontSize: fontSize * 1.2,
          color: "#000",
          fontWeight: "normal",
        },
        axisLabel: {
          fontSize: fontSize,
        },
      },
      series: [
        {
          name: "Admitted",
          type: "bar",
          stack: "Total",
          data: chartData.admitted,
          itemStyle: {
            color: "#3366cc",
            barBorderRadius: 3,
          },
          barWidth: "auto",
        },
        {
          name: "Discharged",
          type: "bar",
          stack: "Total",
          data: chartData.discharged,
          itemStyle: {
            color: "#99ccff",
            barBorderRadius: 3,
          },
          barWidth: "auto",
        },
        {
          name: "Emergency",
          type: "bar",
          stack: "Total",
          data: chartData.emergency,
          itemStyle: {
            color: "#ff9933",
            barBorderRadius: 3,
          },
          barWidth: "auto",
        },
      ],
    };

    const myChart =
      echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
    myChart.setOption(option);
  };

  // Resize event handler
  const handleResize = () => {
    const chartDom = chartRef.current;
    if (chartDom) {
      const myChart = echarts.getInstanceByDom(chartDom);
      if (myChart) {
        myChart.resize();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize); // Add resize event listener
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    updateChart(); // Update the chart whenever chartData changes
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      <div
        ref={chartRef}
        style={{
          width: "500px", // Responsive width
          height: "400px", // Fixed height
        }}
      ></div>
    </div>
  );
};

export default TopDiseaseCase;
