import React, { createContext, useEffect, useState } from "react";
import AreaChart from "../components/AreaChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config/utilities";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import WidgetLoader from "../components/WidgetLoader";

const Home = () => {
  const apiUrl = API_BASE_URL + "/report/dashboard";
  const [apiData, setApiData] = useState();
  const [areaChartData, setAreaChartData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        if (response.data.status === true) {
          const data = response.data.data;
          setApiData(data); // ✅ still update state
          feedGraphData(data); // ✅ use fresh data immediately
          SuccessToast.show(response.data.message);
        } else {
          throw response.data.message;
        }
      } else {
        throw "Oops! Something Went Wrong";
      }
    } catch (error) {
      ErrorToast.show(error);
    } finally {
      setLoader(false);
    }
  };

  const feedGraphData = (data) => {
    const areaChartData = data.find((item) => {
      return item.serial === 1;
    });
    setAreaChartData(areaChartData);
    console.log(areaChartData);

    const pieChartData = data.find((item) => {
      return item.serial === 2;
    });

    const lineChartData = data.find((item) => {
      return item.serial === 3;
    });

    const barChartData = data.find((item) => {
      return item.serial === 4;
    });
  };

  return (
    <>
      {loader ? (
        <WidgetLoader />
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <AreaChart chartData={areaChartData} />
          </div>
          <div className="col-span-4">
            <PieChart />
          </div>
          <div className="col-span-4">
            <LineChart />
          </div>
          <div className="col-span-6">
            <BarChart />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
