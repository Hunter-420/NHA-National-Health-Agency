import React, { Component } from "react";
import * as echarts from "echarts/core";
import { GridComponent, LegendComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, BarChart, CanvasRenderer, LegendComponent]);

class TopDiseaseCase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: null,
        };
        this.chartRef = React.createRef();
    }

    fetchData() {
        const dummyData = {
            admitted: [120, 200, 150, 80, 550],
            discharged: [50, 70, 60, 40, 220],
            emergency: [30, 60, 20, 10, 120],
        };
        this.setState({ chartData: dummyData });
    }

    componentDidMount() {
        this.fetchData();
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.chartData &&
            prevState.chartData !== this.state.chartData
        ) {
            this.updateChart();
        }
    }

    handleResize = () => {
        const chartDom = this.chartRef.current;
        if (chartDom) {
            const myChart = echarts.getInstanceByDom(chartDom);
            if (myChart) {
                myChart.resize();
            }
        }
    };

    updateChart() {
        const { chartData } = this.state;

        const chartDom = this.chartRef.current;
        const containerWidth = chartDom.offsetWidth;
        const fontSize = Math.max(10, containerWidth / 50);

        const option = {
            title: {
                text: "Top Disease Case",
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
                left: "15%", // Increase space for Y-axis title
                right: "10%",
                bottom: 50,
            },
            xAxis: {
                type: "category",
                data: ["Week 1", "Week 2", "Week 3", "Week 4", "Month"],
                axisLabel: {
                    fontSize: fontSize,
                },
            },
            yAxis: {
                type: "value",
                name: "No of Corona Patients",
                nameLocation: "middle", // Center the title along the Y-axis
                nameGap: 50, // Space between title and axis labels
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
    }

    render() {
        return (
            <div>
                <div
                    ref={this.chartRef}
                    style={{
                        width: "500px", // Responsive width
                        height: "400px", // Fixed height
                    }}
                ></div>
            </div>
        );
    }
}

export default TopDiseaseCase;
