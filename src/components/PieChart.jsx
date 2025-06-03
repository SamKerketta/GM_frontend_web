import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { CURRENCY } from "../config/utilities";

const PieChart = () => {
  const [state, setState] = useState({
    series: [100, 80, 20],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Collection", "Balance", "Arrear"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: function (val) {
            return CURRENCY + val + " thousands";
          },
        },
      },
    },
  });

  return (
    <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">DCB Report</h2>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="pie"
        height={355}
      />
    </div>
  );
};

export default PieChart;
