import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import "flowbite";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoutes";
import Members from "./pages/Members";
import PaymentForm from "./pages/PaymentForm";
import PaymentSuccess from "./pages/PaymentSuccess";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/member-payment" element={<PaymentForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
