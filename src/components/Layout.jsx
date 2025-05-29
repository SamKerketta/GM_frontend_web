import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 mt-15 ml-[250px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
