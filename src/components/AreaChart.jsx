// src/components/AreaChart.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = () => {
  const series = [
    {
      name: "Revenue",
      data: [3000, 4000, 3200, 5000, 4800, 5300],
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    tooltip: {
      x: {
        format: "MMM",
      },
    },
  };

  return (
    <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
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
