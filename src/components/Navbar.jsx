import React, { useState } from "react";
import { API_BASE_URL, GYM_NAME } from "../config/utilities";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";
import { Link, useNavigate } from "react-router-dom";
import LogoutService from "../Services/LogoutService";

const Navbar = () => {
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await LogoutService.logout(token);
      if (response.data.status === false) {
        ErrorToast.show(response.data.message);
      } else {
        SuccessToast.show(response.data.message);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userDetails");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      ErrorToast.show("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("userDetails"));

  return (
    <>
      <header className="w-full h-16 bg-white shadow-md flex px-6 fixed top-0 left-64 z-10 grid grid-cols-3 gap-4">
        <h1 class="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl pt-3 col-span-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            {GYM_NAME}
          </span>
        </h1>
        <div className="col-span-1 flex justify-center items-center">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{userInfo.name}</span>
              <span className="block truncate text-sm font-medium">
                {userInfo.email}
              </span>
            </DropdownHeader>
            <DropdownItem>
              <Link to="/">Dashboard</Link>
            </DropdownItem>
            <DropdownItem>
              <Link to="/profile">Profile</Link>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
        </div>
      </header>
    </>
  );
};

export default Navbar;
