import React from "react";
import { GYM_NAME } from "../config/utilities";

const Navbar = () => {
  return (
    <header className="w-full h-16 bg-white shadow-md flex items-center px-6 fixed top-0 left-64 z-10">
      <h1 class="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl pt-3">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {GYM_NAME}
        </span>{" "}
      </h1>
    </header>
  );
};

export default Navbar;
