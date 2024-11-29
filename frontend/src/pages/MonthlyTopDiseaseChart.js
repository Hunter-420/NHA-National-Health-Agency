import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GridComponent, LegendComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer, LegendComponent]);

const MonthlyTopDiseaseChart = () => {
  const chartRef = useRef(null); // Reference to the chart container

  // Static data
  const data = {
    disease_name: "Acid Reflux (GERD)",
    weekly_counts: {
      week1: {
        admitted: 18,
        discharged: 26,
        emergency: 0,
      },
      week2: {
        admitted: 32,
        discharged: 25,
        emergency: 0,
      },
      week3: {
        admitted: 27,
        discharged: 17,
        emergency: 0,
      },
      week4: {
        admitted: 16,
        discharged: 16,
        emergency: 0,
      },
    },
  };

  // Transform static data for the chart
  const transformData = (weeklyCounts) => {
    const weeks = Object.keys(weeklyCounts); // Get week labels
    const admitted = weeks.map((week) => weeklyCounts[week].admitted || 0);
    const discharged = weeks.map((week) => weeklyCounts[week].discharged || 0);
    const emergency = weeks.map((week) => weeklyCounts[week].emergency || 0);
    return { weeks, admitted, discharged, emergency };
  };

  const chartData = transformData(data.weekly_counts);

  const updateChart = () => {
    if (!chartRef.current) return;

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
        data: chartData.weeks, // Use week labels for x-axis
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
    updateChart(); // Update chart when the component mounts
    window.addEventListener("resize", handleResize); // Add resize listener
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

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

export default MonthlyTopDiseaseChart;
