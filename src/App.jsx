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
import AddMember from "./assets/forms/AddMember";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import Invoice from "./components/Invoice";
import InvoiceRouteWrapper from "./components/InvoiceRouteWrapper";

function App() {
  const [openInvoice, setOpenInvoice] = useState(true);

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
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/member-payment" element={<PaymentForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<Plans />} />
          </Route>
          <Route
            path="/invoice/:tranId"
            element={
              <InvoiceRouteWrapper
                openModal={openInvoice}
                setOpenModal={setOpenInvoice}
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
