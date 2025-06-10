import ReactApexChart from "react-apexcharts";

const LineChart = (props) => {
  const series = [
    {
      name: "Number Of Members",
      data: props.chartData?.series,
    },
  ];

  const options = {
    chart: {
      type: "line",
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
      <h2 className="text-xl font-semibold mb-4">Members Admissions</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LineChart;
