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
        <main className="mt-20 md:mt-12 flex-1 md:ml-[250px] px-2 md:px-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
