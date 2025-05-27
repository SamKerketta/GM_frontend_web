import { faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import axios from "axios";
import { API_BASE_URL, CURRENT_DATE } from "../config/utilities";
import ErrorToast from "../components/ErrorToast";
import {
  dmyToYmd,
  getEndingDateByPlanId,
  isNullOrEmpty,
} from "../Services/Utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import SuccessToast from "../components/SuccessToast";

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plans = location.state.plans;
  const memberId = location.state.memberId;
  const [memberDtl, setMemberDtl] = useState([]);
  const [loader, setLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [arrear, setArrear] = useState(0);
  const [tax, setTax] = useState(0);

  const formik = useFormik({
    enableReinitialize: true, // 🔥 This is the key
    initialValues: {
      name: memberDtl.name,
      email: memberDtl.email,
      phoneNo: memberDtl.phone,
      planId: memberDtl.plan_id,
      monthFrom: memberDtl.membership_end
        ? dmyToYmd(memberDtl.membership_end)
        : CURRENT_DATE,
      expiringOn: null,
      durationInMonths: 0,
      membershipFee: plans.find((plan) => plan.id === memberDtl.plan_id)?.price,
      paymentMethod: "CASH",
    },
    validationSchema: Yup.object({
      planId: Yup.number()
        .typeError("Plan is Invalid") // handles string inputs like "abc"
        .integer("Plan ID must be an integer")
        .required("Please Enter This Field"),
      monthFrom: Yup.date().required("Please Enter This Field"),
    }),
    onSubmit: (values, { resetForm }) => {
      submitPayment(values, resetForm);
    },
  });

  const submitPayment = async (values, resetForm) => {
    console.log(values);
    setLoader(true);
    const apiUrl = `${API_BASE_URL}/payment/offline`;
    const token = localStorage.getItem("authToken");
    const payload = {
      memberId: memberDtl.id,
      planId: values.planId,
      amountPaid: values.membershipFee,
      paymentFor: "plan",
      paymentMethod: "CASH",
      monthFrom: values.monthFrom,
    };

    try {
      await axios
        .post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.status === true) {
              SuccessToast.show(response.data.message);
              // resetForm();
              navigate("/payment-success", {
                state: {
                  invoiceNo: response.data.data,
                  amount: formik.values.membershipFee,
                  paymentMethod: formik.values.paymentMethod,
                  recipient: formik.values.name,
                },
              });
            }
            if (response.data.status === false) {
              throw response.data.message;
            }
          }

          if (response.status != 200) {
            throw response.statusText;
          }
        });
    } catch (error) {
      ErrorToast.show(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMemberDetail();
  }, []);

  useEffect(() => {
    calculationPayments();
  }, [formik.values.planId, formik.values.monthFrom]);

  // Calculation of Payments
  const calculationPayments = async () => {
    const formattedlaterDate = await getEndingDateByPlanId(
      formik.values.monthFrom,
      formik.values.planId,
      formik.values.durationInMonths
    );
    formik.setFieldValue("expiringOn", formattedlaterDate);
    setTotal(formik.values.membershipFee);
  };

  // Function to get member's details
  const fetchMemberDetail = async () => {
    setLoader(true);
    const apiUrl = `${API_BASE_URL}/crud/member/detail`;
    const token = localStorage.getItem("authToken");

    try {
      await axios
        .post(
          apiUrl,
          {
            id: memberId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            if (response.data.status === true) {
              setMemberDtl(response.data.data);
              console.log(memberDtl);
            }
            if (response.data.status === false) {
              throw response.data.message;
            }
          }

          if (response.status != 200) {
            throw response.statusText;
          }
        });
    } catch (error) {
      ErrorToast.show(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <form onSubmit={formik.handleSubmit} className="mx-auto px-5">
          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            <li className="after:border-1 flex items-center after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Members
              </span>
            </li>
            <li className="flex shrink-0 items-center  text-primary-700">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Payment Summary
            </li>
          </ol>
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <FontAwesomeIcon icon={faUser} /> Member's Payment{" "}
                  {!isNullOrEmpty(memberDtl.member_id) && (
                    <span className="text-red-700">
                      ({memberDtl.member_id})
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      placeholder="name@flowbite.com"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNo"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <div className="flex items-center">
                      <button
                        id="dropdown-phone-button-3"
                        data-dropdown-toggle="dropdown-phone-3"
                        className="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 900 600"
                          width="24"
                          height="16"
                          aria-hidden="true"
                        >
                          {/* Saffron */}
                          <rect width="900" height="200" fill="#FF9933" />
                          {/* White */}
                          <rect
                            y="200"
                            width="900"
                            height="200"
                            fill="#FFFFFF"
                          />
                          {/* Green */}
                          <rect
                            y="400"
                            width="900"
                            height="200"
                            fill="#138808"
                          />
                          {/* Ashoka Chakra */}
                          <circle
                            cx="450"
                            cy="300"
                            r="60"
                            fill="none"
                            stroke="#000088"
                            strokeWidth="4"
                          />
                          {[...Array(24)].map((_, i) => {
                            const angle = (360 / 24) * i;
                            return (
                              <line
                                key={i}
                                x1="450"
                                y1="240"
                                x2="450"
                                y2="360"
                                stroke="#000088"
                                strokeWidth="2"
                                transform={`rotate(${angle} 450 300)`}
                              />
                            );
                          })}
                        </svg>
                        +91
                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 9-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        id="dropdown-phone-3"
                        className="z-10 hidden w-56 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
                      >
                        <ul
                          className="p-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdown-phone-button-2"
                        >
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              <span className="inline-flex items-center">
                                <svg
                                  fill="none"
                                  aria-hidden="true"
                                  className="me-2 h-4 w-4"
                                  viewBox="0 0 20 15"
                                >
                                  <rect
                                    width="19.6"
                                    height={14}
                                    y=".5"
                                    fill="#fff"
                                    rx={2}
                                  />
                                  <mask
                                    id="a"
                                    style={{ maskType: "luminance" }}
                                    width={20}
                                    height={15}
                                    x={0}
                                    y={0}
                                    maskUnits="userSpaceOnUse"
                                  >
                                    <rect
                                      width="19.6"
                                      height={14}
                                      y=".5"
                                      fill="#fff"
                                      rx={2}
                                    />
                                  </mask>
                                  <g mask="url(#a)">
                                    <path
                                      fill="#D02F44"
                                      fillRule="evenodd"
                                      d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      fill="#46467F"
                                      d="M0 .5h8.4v6.533H0z"
                                    />
                                    <g filter="url(#filter0_d_343_121520)">
                                      <path
                                        fill="url(#paint0_linear_343_121520)"
                                        fillRule="evenodd"
                                        d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                                        clipRule="evenodd"
                                      />
                                    </g>
                                  </g>
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear_343_121520"
                                      x1=".933"
                                      x2=".933"
                                      y1="1.433"
                                      y2="6.1"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stopColor="#fff" />
                                      <stop offset={1} stopColor="#F0F0F0" />
                                    </linearGradient>
                                    <filter
                                      id="filter0_d_343_121520"
                                      width="6.533"
                                      height="5.667"
                                      x=".933"
                                      y="1.433"
                                      colorInterpolationFilters="sRGB"
                                      filterUnits="userSpaceOnUse"
                                    >
                                      <feFlood
                                        floodOpacity={0}
                                        result="BackgroundImageFix"
                                      />
                                      <feColorMatrix
                                        in="SourceAlpha"
                                        result="hardAlpha"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      />
                                      <feOffset dy={1} />
                                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                      <feBlend
                                        in2="BackgroundImageFix"
                                        result="effect1_dropShadow_343_121520"
                                      />
                                      <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_dropShadow_343_121520"
                                        result="shape"
                                      />
                                    </filter>
                                  </defs>
                                </svg>
                                United States (+1)
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              <span className="inline-flex items-center">
                                <svg
                                  className="me-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 20 15"
                                >
                                  <rect
                                    width="19.6"
                                    height={14}
                                    y=".5"
                                    fill="#fff"
                                    rx={2}
                                  />
                                  <mask
                                    id="a"
                                    style={{ maskType: "luminance" }}
                                    width={20}
                                    height={15}
                                    x={0}
                                    y={0}
                                    maskUnits="userSpaceOnUse"
                                  >
                                    <rect
                                      width="19.6"
                                      height={14}
                                      y=".5"
                                      fill="#fff"
                                      rx={2}
                                    />
                                  </mask>
                                  <g mask="url(#a)">
                                    <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                                    <path
                                      fill="#fff"
                                      fillRule="evenodd"
                                      d="M-.898-.842L7.467 4.8V-.433h4.667V4.8l8.364-5.642L21.542.706l-6.614 4.46H19.6v4.667h-4.672l6.614 4.46-1.044 1.549-8.365-5.642v5.233H7.467V10.2l-8.365 5.642-1.043-1.548 6.613-4.46H0V5.166h4.672L-1.941.706-.898-.842z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      stroke="#DB1F35"
                                      strokeLinecap="round"
                                      strokeWidth=".667"
                                      d="M13.067 4.933L21.933-.9M14.009 10.088l7.947 5.357M5.604 4.917L-2.686-.67M6.503 10.024l-9.189 6.093"
                                    />
                                    <path
                                      fill="#E6273E"
                                      fillRule="evenodd"
                                      d="M0 8.9h8.4v5.6h2.8V8.9h8.4V6.1h-8.4V.5H8.4v5.6H0v2.8z"
                                      clipRule="evenodd"
                                    />
                                  </g>
                                </svg>
                                United Kingdom (+44)
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              <span className="inline-flex items-center">
                                <svg
                                  className="me-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 20 15"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    width="19.6"
                                    height={14}
                                    y=".5"
                                    fill="#fff"
                                    rx={2}
                                  />
                                  <mask
                                    id="a"
                                    style={{ maskType: "luminance" }}
                                    width={20}
                                    height={15}
                                    x={0}
                                    y={0}
                                    maskUnits="userSpaceOnUse"
                                  >
                                    <rect
                                      width="19.6"
                                      height={14}
                                      y=".5"
                                      fill="#fff"
                                      rx={2}
                                    />
                                  </mask>
                                  <g mask="url(#a)">
                                    <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                                    <path
                                      fill="#fff"
                                      stroke="#fff"
                                      strokeWidth=".667"
                                      d="M0 .167h-.901l.684.586 3.15 2.7v.609L-.194 6.295l-.14.1v1.24l.51-.319L3.83 5.033h.73L7.7 7.276a.488.488 0 00.601-.767L5.467 4.08v-.608l2.987-2.134a.667.667 0 00.28-.543V-.1l-.51.318L4.57 2.5h-.73L.66.229.572.167H0z"
                                    />
                                    <path
                                      fill="url(#paint0_linear_374_135177)"
                                      fillRule="evenodd"
                                      d="M0 2.833V4.7h3.267v2.133c0 .369.298.667.666.667h.534a.667.667 0 00.666-.667V4.7H8.2a.667.667 0 00.667-.667V3.5a.667.667 0 00-.667-.667H5.133V.5H3.267v2.333H0z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      fill="url(#paint1_linear_374_135177)"
                                      fillRule="evenodd"
                                      d="M0 3.3h3.733V.5h.934v2.8H8.4v.933H4.667v2.8h-.934v-2.8H0V3.3z"
                                      clipRule="evenodd"
                                    />
                                    <path
                                      fill="#fff"
                                      fillRule="evenodd"
                                      d="M4.2 11.933l-.823.433.157-.916-.666-.65.92-.133.412-.834.411.834.92.134-.665.649.157.916-.823-.433zm9.8.7l-.66.194.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.194zm0-8.866l-.66.193.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.193zm2.8 2.8l-.66.193.193-.66-.193-.66.66.193.66-.193-.193.66.193.66-.66-.193zm-5.6.933l-.66.193.193-.66-.193-.66.66.194.66-.194-.193.66.193.66-.66-.193zm4.2 1.167l-.33.096.096-.33-.096-.33.33.097.33-.097-.097.33.097.33-.33-.096z"
                                      clipRule="evenodd"
                                    />
                                  </g>
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear_374_135177"
                                      x1={0}
                                      x2={0}
                                      y1=".5"
                                      y2="7.5"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stopColor="#fff" />
                                      <stop offset={1} stopColor="#F0F0F0" />
                                    </linearGradient>
                                    <linearGradient
                                      id="paint1_linear_374_135177"
                                      x1={0}
                                      x2={0}
                                      y1=".5"
                                      y2="7.033"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stopColor="#FF2E3B" />
                                      <stop offset={1} stopColor="#FC0D1B" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                Australia (+61)
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              <span className="inline-flex items-center">
                                <svg
                                  className="me-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 20 15"
                                >
                                  <rect
                                    width="19.6"
                                    height={14}
                                    y=".5"
                                    fill="#fff"
                                    rx={2}
                                  />
                                  <mask
                                    id="a"
                                    style={{ maskType: "luminance" }}
                                    width={20}
                                    height={15}
                                    x={0}
                                    y={0}
                                    maskUnits="userSpaceOnUse"
                                  >
                                    <rect
                                      width="19.6"
                                      height={14}
                                      y=".5"
                                      fill="#fff"
                                      rx={2}
                                    />
                                  </mask>
                                  <g mask="url(#a)">
                                    <path
                                      fill="#262626"
                                      fillRule="evenodd"
                                      d="M0 5.167h19.6V.5H0v4.667z"
                                      clipRule="evenodd"
                                    />
                                    <g filter="url(#filter0_d_374_135180)">
                                      <path
                                        fill="#F01515"
                                        fillRule="evenodd"
                                        d="M0 9.833h19.6V5.167H0v4.666z"
                                        clipRule="evenodd"
                                      />
                                    </g>
                                    <g filter="url(#filter1_d_374_135180)">
                                      <path
                                        fill="#FFD521"
                                        fillRule="evenodd"
                                        d="M0 14.5h19.6V9.833H0V14.5z"
                                        clipRule="evenodd"
                                      />
                                    </g>
                                  </g>
                                  <defs>
                                    <filter
                                      id="filter0_d_374_135180"
                                      width="19.6"
                                      height="4.667"
                                      x={0}
                                      y="5.167"
                                      colorInterpolationFilters="sRGB"
                                      filterUnits="userSpaceOnUse"
                                    >
                                      <feFlood
                                        floodOpacity={0}
                                        result="BackgroundImageFix"
                                      />
                                      <feColorMatrix
                                        in="SourceAlpha"
                                        result="hardAlpha"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      />
                                      <feOffset />
                                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                      <feBlend
                                        in2="BackgroundImageFix"
                                        result="effect1_dropShadow_374_135180"
                                      />
                                      <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_dropShadow_374_135180"
                                        result="shape"
                                      />
                                    </filter>
                                    <filter
                                      id="filter1_d_374_135180"
                                      width="19.6"
                                      height="4.667"
                                      x={0}
                                      y="9.833"
                                      colorInterpolationFilters="sRGB"
                                      filterUnits="userSpaceOnUse"
                                    >
                                      <feFlood
                                        floodOpacity={0}
                                        result="BackgroundImageFix"
                                      />
                                      <feColorMatrix
                                        in="SourceAlpha"
                                        result="hardAlpha"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      />
                                      <feOffset />
                                      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                      <feBlend
                                        in2="BackgroundImageFix"
                                        result="effect1_dropShadow_374_135180"
                                      />
                                      <feBlend
                                        in="SourceGraphic"
                                        in2="effect1_dropShadow_374_135180"
                                        result="shape"
                                      />
                                    </filter>
                                  </defs>
                                </svg>
                                Germany (+49)
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              role="menuitem"
                            >
                              <span className="inline-flex items-center">
                                <svg
                                  className="me-2 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 20 15"
                                >
                                  <rect
                                    width="19.1"
                                    height="13.5"
                                    x=".25"
                                    y=".75"
                                    fill="#fff"
                                    stroke="#F5F5F5"
                                    strokeWidth=".5"
                                    rx="1.75"
                                  />
                                  <mask
                                    id="a"
                                    style={{ maskType: "luminance" }}
                                    width={20}
                                    height={15}
                                    x={0}
                                    y={0}
                                    maskUnits="userSpaceOnUse"
                                  >
                                    <rect
                                      width="19.1"
                                      height="13.5"
                                      x=".25"
                                      y=".75"
                                      fill="#fff"
                                      stroke="#fff"
                                      strokeWidth=".5"
                                      rx="1.75"
                                    />
                                  </mask>
                                  <g mask="url(#a)">
                                    <path
                                      fill="#F44653"
                                      d="M13.067.5H19.6v14h-6.533z"
                                    />
                                    <path
                                      fill="#1035BB"
                                      fillRule="evenodd"
                                      d="M0 14.5h6.533V.5H0v14z"
                                      clipRule="evenodd"
                                    />
                                  </g>
                                </svg>
                                France (+33)
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="relative w-full">
                        <input
                          type="text"
                          id="phoneNo"
                          className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          placeholder="123-456-7890"
                          onChange={formik.handleChange}
                          value={formik.values.phoneNo}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="planId"
                      className={`block mb-2 text-sm font-medium
                                                ${
                                                  formik.touched.planId &&
                                                  formik.errors.planId
                                                    ? "text-red-900"
                                                    : "text-gray-900 dark:text-white"
                                                }
                                                    `}
                    >
                      Select Plan
                    </label>
                    <select
                      id="planId"
                      className={`border text-sm rounded-lg block w-full p-2.5
                                                ${
                                                  formik.touched.planId &&
                                                  formik.errors.planId
                                                    ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                                                    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                }
                                                    `}
                      onChange={(e) => {
                        const selectedOption = e.target.selectedOptions[0];
                        const duration =
                          selectedOption.getAttribute("data-duration");
                        const price = selectedOption.getAttribute("data-price");
                        const isAdmitFee =
                          selectedOption.getAttribute("data-isadmitfee");

                        formik.setFieldValue("planId", e.target.value);
                        formik.setFieldValue("durationInMonths", duration);
                        formik.setFieldValue("membershipFee", price);
                        formik.setFieldValue("isAdmitFee", isAdmitFee);
                      }}
                      value={formik.values.planId}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Plan</option>
                      {plans.map((plan) => (
                        <option
                          data-duration={plan.duration}
                          data-price={plan.price}
                          data-isadmitfee={plan.is_admission_fee_required}
                          value={plan.id}
                        >
                          {plan.plan_name}
                          <span class="text-sm text-gray-500">
                            ({plan.duration} In Months)
                          </span>
                        </option>
                      ))}
                    </select>
                    {formik.touched.planId && formik.errors.planId ? (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.planId}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="monthFrom"
                      className={`block mb-2 text-sm font-medium
                                                ${
                                                  formik.touched.monthFrom &&
                                                  formik.errors.monthFrom
                                                    ? "text-red-900"
                                                    : "text-gray-900 dark:text-white"
                                                }
                                                    `}
                    >
                      Starting From
                    </label>
                    <input
                      type="date"
                      id="monthFrom"
                      className={`border text-sm rounded-lg block w-full p-2.5
                                                ${
                                                  formik.touched.monthFrom &&
                                                  formik.errors.monthFrom
                                                    ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                                                    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                }
                                                    `}
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.monthFrom}
                    />

                    {formik.touched.monthFrom && formik.errors.monthFrom ? (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">
                          {formik.errors.monthFrom}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="expiringOn"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Expiring On
                    </label>
                    <input
                      type="date"
                      id="expiringOn"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      value={formik.values.expiringOn}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Payment Methods
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="cash"
                          aria-describedby="credit-card-text"
                          type="radio"
                          name="paymentMethod"
                          value="CASH"
                          defaultValue
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          defaultChecked
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="cash"
                          className="font-medium leading-none text-gray-900 dark:text-white"
                        >
                          Cash
                        </label>
                        <p
                          id="cash"
                          name="paymentMethod"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                        >
                          Pay with cash amount
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="upi"
                          aria-describedby="pay-on-delivery-text"
                          type="radio"
                          name="paymentMethod"
                          value="UPI"
                          defaultValue
                          onChange={formik.handleChange}
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="upi"
                          className="font-medium leading-none text-gray-900 dark:text-white"
                        >
                          UPI
                        </label>
                        <p
                          id="pay-on-delivery-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                        >
                          +0 payment processing fee
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="bank"
                          aria-describedby="paypal-text"
                          type="radio"
                          name="paymentMethod"
                          defaultValue
                          value="BANK_TRANSFER"
                          onChange={formik.handleChange}
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label
                          htmlFor="bank"
                          className="font-medium leading-none text-gray-900 dark:text-white"
                        >
                          Bank Transfer
                        </label>
                        <p
                          id="paypal-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                        >
                          +0 payment processing fee
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Subtotal
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      ₹{formik.values.membershipFee || 0}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Arrear
                    </dt>
                    <dd className="text-base font-medium text-green-500">
                      {arrear}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Discount
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formik.values.discount ?? 0}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {tax}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      ₹{formik.values.membershipFee || 0}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={loader}
                >
                  {loader ? (
                    <>
                      <div>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 me-3 text-white animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        Loading...
                      </div>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                      Proceed to Pay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default PaymentForm;
