import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DiseaseChart extends Component {
    // Function to generate fluctuating data
    generateFluctuatedData(baseData) {
        return baseData.map((baseValue) => {
            // Random fluctuation between -10 and +10 for each month
            const fluctuation = Math.floor(Math.random() * 21) - 10;
            return baseValue + fluctuation;
        });
    }

    render() {
        const diseaseData = [
            { disease_name: "Dengue", province: "Kathmandu", dataPoints: this.generateFluctuatedData([155, 150, 152, 148, 142, 150, 146, 149, 153, 158, 154, 150]) },
            { disease_name: "Malaria", province: "Pokhara", dataPoints: this.generateFluctuatedData([145, 140, 142, 138, 132, 140, 136, 139, 143, 148, 144, 140]) },
            { disease_name: "Cholera", province: "Lalitpur", dataPoints: this.generateFluctuatedData([125, 120, 122, 118, 112, 120, 116, 119, 123, 128, 124, 120]) }
        ];

        // Static colors for the lines
        const lineColors = [
            "#FF6347", // Tomato Red for Dengue
            "#32CD32", // Lime Green for Malaria
            "#FFD700"  // Gold for Cholera
        ];

        const options = {
            animationEnabled: true,
            backgroundColor: "transparent", // Set background color
            title: {
                text: "Disease Analysis in Nepal",
                fontColor: "blue" // Set title font color to white
            },
            axisY: {
                title: "", // Number of Patients Affected
                labelFontColor: "blue", // Set Y-axis labels font color to white
                titleFontColor: "black",  // Set Y-axis title font color to white
                gridThickness: 0  // Hide the horizontal grid lines
            },
            axisX: {
                labelFontColor: "black" // Set X-axis labels font color to white
            },
            toolTip: {
                shared: true,
                content: function (e) {
                    let content = "<strong>" + e.entries[0].dataPoint.label + "</strong><br>";
                    e.entries.forEach(entry => {
                        const diseaseName = entry.dataPoint.disease_name;
                        const province = entry.dataPoint.province;
                        const patients = entry.dataPoint.y;
                        content += `<strong>${diseaseName}</strong> - ${province}: ${patients} patients affected<br>`;
                    });
                    return content;
                },
                fontColor: "black" // Set tooltip text color to white
            },
            legend: {
                fontColor: "black" // Set legend font color to white
            },
            data: diseaseData.map((disease, index) => ({
                type: "spline",
                name: disease.disease_name,
                showInLegend: true,
                color: lineColors[index], // Assign static color for each disease
                lineThickness: 3, // Set line thickness to 3 (can be adjusted for larger or smaller lines)
                dataPoints: disease.dataPoints.map((y, index) => ({
                    y,
                    label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][index],
                    disease_name: disease.disease_name,
                    province: disease.province
                }))
            }))
        };

        return (
            <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default DiseaseChart;
