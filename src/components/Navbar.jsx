import React from "react";
import { GYM_NAME } from "../config/utilities";

const Navbar = () => {
  return (
    <header className="w-full h-16 bg-white shadow-md flex items-center px-6 fixed top-0 left-64 z-10">
      <h1 className="text-xl font-semibold">{GYM_NAME}</h1>
    </header>
  );
};

export default Navbar;
