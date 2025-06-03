import ReactApexChart from "react-apexcharts";

const BarChart = () => {
  const series = [
    {
      name: "Number Of Members",
      data: [10, 20, 2],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["Morning", "Evening", "Others"],
    },
  };

  return (
    <>
      <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Shift Wise Members</h2>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
};

export default BarChart;
