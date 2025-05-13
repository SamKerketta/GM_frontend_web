import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <main className="ml-64 mt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
