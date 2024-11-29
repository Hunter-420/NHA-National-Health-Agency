import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { useNavigate } from 'react-router-dom';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DiseaseChart = () => {
    const navigate = useNavigate(); // Get navigate function

    // Function to generate fluctuating data
    const generateFluctuatedData = (baseData) => {
        return baseData.map((baseValue) => {
            const fluctuation = Math.floor(Math.random() * 21) - 10; // Random fluctuation
            return baseValue + fluctuation;
        });
    };

    const handleLineClick = (diseaseName) => {
        navigate(`/province/${diseaseName}`); // Use navigate to redirect
    };

    const diseaseData = [
        { disease_name: "Dengue", province: "Kathmandu", dataPoints: generateFluctuatedData([155, 150, 152, 148, 142, 150, 146, 149, 153, 158, 154, 150]) },
        { disease_name: "Malaria", province: "Pokhara", dataPoints: generateFluctuatedData([145, 140, 142, 138, 132, 140, 136, 139, 143, 148, 144, 140]) },
        { disease_name: "Cholera", province: "Lalitpur", dataPoints: generateFluctuatedData([125, 120, 122, 118, 112, 120, 116, 119, 123, 128, 124, 120]) }
    ];

    const lineColors = ["#FF6347", "#32CD32", "#FFD700"]; // Static line colors

    const options = {
        animationEnabled: true,
        backgroundColor: "#2256CC",
        title: {
            text: "Disease Analysis in Nepal",
            fontColor: "#00FFFF"
        },
        axisY: {
            labelFontColor: "white",
            gridThickness: 0
        },
        axisX: {
            labelFontColor: "white"
        },
        toolTip: {
            shared: true,
            contentFormatter: function (e) {
                let content = "<strong>" + e.entries[0].dataPoint.label + "</strong><br>";
                e.entries.forEach((entry) => {
                    content += `<strong>${entry.dataSeries.name}</strong>: ${entry.dataPoint.y} patients<br>`;
                });
                return content;
            }
        },
        legend: {
            fontColor: "white"
        },
        data: diseaseData.map((disease, index) => ({
            type: "spline",
            name: disease.disease_name,
            showInLegend: true,
            color: lineColors[index],
            lineThickness: 3,
            dataPoints: disease.dataPoints.map((y, index) => ({
                y,
                label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][index]
            })),
            click: () => handleLineClick(disease.disease_name) // Add the click handler
        }))
    };

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default DiseaseChart;
