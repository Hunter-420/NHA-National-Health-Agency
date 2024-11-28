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
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.chartData &&
            prevState.chartData !== this.state.chartData
        ) {
            this.updateChart();
        }
    }

    updateChart() {
        const { chartData } = this.state;

        const option = {
            title: {
                text: "Top Disease Case", // Title text
                left: "center", // Center align the title
                top: "10", // Place it near the top
                textStyle: {
                    fontSize: 18, // Visible font size for the title
                    fontWeight: "bold", // Bold text
                    color: "#000", // Black color
                },
            },
            legend: {
                top: 40, // Adjust legend position
                right: "10%",
                orient: "horizontal",
                data: ["Admitted", "Discharged", "Emergency"],
                textStyle: {
                    fontSize: 12,
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
                top: 80, // Space for title and legend
                left: "10%",
                right: "10%",
                bottom: 50,
            },
            xAxis: {
                type: "category",
                data: ["Week 1", "Week 2", "Week 3", "Week 4", "Month"],
                axisLine: {
                    lineStyle: {
                        color: "#000",
                    },
                },
                axisLabel: {
                    fontSize: 12,
                },
            },
            yAxis: {
                type: "value",
                name: "No of Corona Patients",
                nameTextStyle: {
                    fontSize: 15, // Style for the "No of Patients" label
                    color: "#000000", // Black color
                    fontWeight: "normal", // Bold text
                },
                axisLine: {
                    lineStyle: {
                        color: "#000",
                    },
                },
                axisLabel: {
                    fontSize: 12,
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
                    label: {
                        show: false,
                        position: "insideTop",
                        fontSize: 10,
                        color: "#fff",
                    },
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
                    barWidth: 50,
                    barCategoryGap: "10%",
                    label: {
                        show: false,
                        position: "insideTop",
                        fontSize: 10,
                        color: "#000",
                    },
                },
            ],
        };

        const chartDom = this.chartRef.current;
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
                        width: "750px",
                        height: "550px",
                        margin: "0 auto",
                    }}
                ></div>
            </div>
        );
    }
}

export default TopDiseaseCase;
