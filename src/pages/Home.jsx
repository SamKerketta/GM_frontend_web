import React, { useState } from "react";
import AreaChart from "../components/AreaChart";
import PieChart from "../components/PieChart";
import LineChart from "../components/LIneChart";

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <AreaChart />
        </div>
        <div className="col-span-4">
          <PieChart />
        </div>
        <div className="col-span-4">
          <LineChart />
        </div>
      </div>
    </>
  );
};

export default Home;
