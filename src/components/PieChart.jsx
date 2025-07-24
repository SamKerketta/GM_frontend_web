import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { CURRENCY } from "../config/utilities";

const PieChart = (props) => {
  const [state, setState] = useState({
    series: props.chartData?.series,
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: props.chartData?.labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "right",
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
      legend: {
        position: 'right',
        floating: false,
        offsetY: 10,
      }
    },
  });

  return (
    <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow-md mx-auto pb-20 md:pb-5">
      <h2 className="text-xl font-semibold mb-4">{props.chartData?.name}</h2>
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
