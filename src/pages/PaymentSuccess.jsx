import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDateInLongFormat } from "../Services/Utils";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/members", {
        state: {
          page: location.state.currentPage,
        },
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <>
      <div className="flex items-center justify-center  px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2l4 -4m5 2a9 9 0 11-18 0a9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          {/* Success Text */}
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Here are the details:
          </p>
          {/* Payment Info */}
          <div className="text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Recipient:</span>
              <span className="font-medium text-gray-800">
                {location.state.recipient}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice Number:</span>
              <span className="font-medium text-gray-800">
                {location.state.invoiceNo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Amount:</span>
              <span className="font-medium text-gray-800">
                ₹{location.state.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Date:</span>
              <span className="font-medium text-gray-800">
                {getDateInLongFormat()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium text-gray-800">
                {location.state.paymentMethod}
              </span>
            </div>
          </div>
          {/* Return/Home Button */}
          <div className="mt-8">
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Go to Dashboard
            </a>

            {/* Countdown Message */}
            <div className="mt-6 flex items-center justify-center bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3">
              <svg
                className="w-5 h-5 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              <span>
                You are redirecting to the payment list in{" "}
                <strong>{countdown} seconds</strong>...
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
