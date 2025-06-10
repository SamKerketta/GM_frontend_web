// src/components/AreaChart.jsx
import React, { useContext } from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = (props) => {
  const series = [
    {
      name: "Revenue",
      data: props.chartData?.series,
    },
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#3B82F6"], // Tailwind blue-500
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: props.chartData?.labels,
    },
    tooltip: {
      x: {
        format: "MMM",
      },
    },
  };

  return (
    <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">{props.chartData?.name}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default AreaChart;
