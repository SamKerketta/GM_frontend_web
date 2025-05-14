import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="mt-15 ml-[250px]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
