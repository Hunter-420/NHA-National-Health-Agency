import React from 'react'
import ReactECharts from 'echarts-for-react';
function Echarts() {
    const chartOptions = {
        title: {
          text: 'ECharts Line Chart Example',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Sales',
            type: 'line',
            data: [150, 230, 224, 218, 135, 147, 260],
          },
        ],
      };
    
      return (
        <div  >
          <ReactECharts option={chartOptions} />
        </div>
      );
}

export default Echarts
