// components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL, AUTH_TOKEN } from "../config/utilities";
import ErrorToast from "./ErrorToast";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const token = AUTH_TOKEN + "test";
  const endpoint = API_BASE_URL + "/heartbeat";
  const [loader, setLoader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // null = not checked yet

  useEffect(() => {
    const checkTokenExpiration = async () => {
      setLoader(true);
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        } else {
          ErrorToast.show(error);
        }
      } finally {
        setLoader(false);
      }
    };

    if (token) {
      checkTokenExpiration();
    } else {
      setIsAuthenticated(false);
      setLoader(false);
    }
  }, [token]);

  if (loader) {
    return <div>Loading...</div>; // or your spinner
  }

  // console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
  // return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
