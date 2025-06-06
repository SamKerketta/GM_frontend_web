import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "flowbite";
import {
  Button,
  HelperText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  ADMITION_FEE,
  API_BASE_URL,
  AUTH_TOKEN,
  CURRENT_DATE,
  SHIFTS,
  SUPPORTED_FORMATS,
} from "../../config/utilities";
import ErrorToast from "../../components/ErrorToast";
import axios from "axios";
import SuccessToast from "../../components/SuccessToast";
import { getEndingDateByPlanId } from "../../Services/Utils";
import { useNavigate } from "react-router-dom";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

/**
 * Things to do
 * 2. Add Discount Columns (In enhancement)
 */

const AddMember = ({
  openMemberModal,
  setOpenMemberModal,
  setreloadMembers,
}) => {
  const addMemberApi = `${API_BASE_URL}/crud/member/add-member`;
  const currentDate = CURRENT_DATE;
  const [plans, setPlans] = useState([]);
  const planListApi = `${API_BASE_URL}/crud/plans/list`;
  const navigate = useNavigate();
  const [previewProfile, setPreviewProfile] = useState(
    "https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg"
  );

  // Fetch Plan list
  useEffect(() => {
    axios.post(`${planListApi}`).then((response) => {
      if (response.status === 200) {
        const apiData = response.data;
        if (apiData.status === true) {
          setPlans(apiData.data);
        }
      } else {
        ErrorToast.show(response.data.message);
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      planId: "",
      shiftId: "",
      address: "",
      membershipStart: currentDate,
      endDate: "",
      isPayment: true,
      admissionFee: 0,
      membershipFee: 0,
      payableAmt: 0,
      tac: true,
      durationInMonths: 0,
      isAdmitFee: 0,
      photo: null
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(25, "Must be 25 characters or less")
        .required("Please Enter This Field"),
      email: Yup.string()
        .email("Invalid Email Address")
        .max(25, "Must be 25 characters or less")
        .required("Please Enter This Field"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be Valid Number")
        .required("Please Enter This Field"),
      dob: Yup.date()
        .max(new Date(), "Date Range can not be in future")
        .required("Please Enter Date Of Birth"),
      gender: Yup.string()
        .oneOf(["male", "female"], 'Gender must be either "Male" or "Female"')
        .required("Please Enter This Field"),
      planId: Yup.number()
        .typeError("Plan ID must be a number") // handles string inputs like "abc"
        .integer("Plan ID must be an integer")
        .required("Please Enter This Field"),
      shiftId: Yup.number()
        .typeError("Plan ID must be a number") // handles string inputs like "abc"
        .integer("Plan ID must be an integer")
        .required("Please Enter This Field"),
      address: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Please Enter This Field"),
      membershipStart: Yup.date().required("Please Enter This Field"),
      isPayment: Yup.boolean().oneOf(
        [true],
        "Payment is required while adding the member"
      ),
      tac: Yup.boolean().oneOf(
        [true],
        "You must agree with our terms and conditions"
      ),
      photo: Yup.mixed()
        .required('Please upload member photo')
        .test('fileType', 'Only JPG/PNG files are allowed', (value) => {
          return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test('fileSize', 'File size too large (max 2MB)', (value) => {
          return value && value.size <= 2 * 1024 * 1024; // 2MB
        }),
    }),
    onSubmit: (values, { resetForm }) => {
      submitMember(values, resetForm);
    },
  });

  // Submit Members api call
  const submitMember = (payload, resetForm) => {
    axios.post(`${addMemberApi}`, payload, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      if (response.status === 200) {
        const apiData = response.data;
        if (apiData.status === true) {
          SuccessToast.show(apiData.message);
          resetForm();
          navigate("/members");
        }
        if (apiData.status === false) {
          ErrorToast.show(apiData.message);
        }
      } else {
        ErrorToast.show(response.data.message);
      }
    });
  };

  useEffect(() => {
    if (formik.values.membershipStart && formik.values.planId) {
      const formattedlaterDate = getEndingDateByPlanId(
        formik.values.membershipStart,
        formik.values.planId,
        formik.values.durationInMonths
      );
      formik.setFieldValue("endDate", formattedlaterDate);
    }
  }, [formik.values.membershipStart, formik.values.planId]);

  // Payment Calculation
  useEffect(() => {
    if (formik.values.isPayment) {
      const admissionFee = formik.values.isAdmitFee == 1 ? ADMITION_FEE : 0;
      const membershipFeePerMonth = Number(formik.values.membershipFee); // Vary as per Plan
      const totalPayableAmt = admissionFee + membershipFeePerMonth;

      formik.setFieldValue("admissionFee", admissionFee);
      formik.setFieldValue("membershipFee", membershipFeePerMonth);
      formik.setFieldValue("payableAmt", totalPayableAmt);
    }
  }, [formik.values.isPayment, formik.values.planId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewProfile(imageUrl);
      formik.setFieldValue('photo', e.currentTarget.files[0])
    }
  };

  return (
    <>
      <div class="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faUsers} /> Add Member
          </h2>
        </div>
        <div className="col-span-12 mt-[-10px]">
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
      </div>
      {/* Main modal */}
      <form
        onSubmit={formik.handleSubmit}
        className="mt-1 mb-2 container mx-auto"
      >
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="p-4 md:p-5">
            <div class="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label
                  htmlFor="name"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.name &&
                      formik.errors.name
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.name &&
                      formik.errors.name
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  placeholder="Member's Name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  color="failure"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.name}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-4">
                <label
                  htmlFor="email"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.email &&
                      formik.errors.email
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@gmail.com"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.email &&
                      formik.errors.email
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.email}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-4">
                <label
                  htmlFor="phone"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.phone &&
                      formik.errors.phone
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Mobile
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="0123456789"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.phone &&
                      formik.errors.phone
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.phone}</span>
                  </div>
                ) : null}
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="dob"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.dob &&
                      formik.errors.dob
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.dob &&
                      formik.errors.dob
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  max={currentDate}
                  value={formik.values.dob}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.dob}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="gender"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.gender &&
                      formik.errors.gender
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.gender &&
                      formik.errors.gender
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  onBlur={formik.handleBlur}
                >
                  <option value=""></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.gender}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="planId"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.planId &&
                      formik.errors.planId
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Select Plan
                </label>
                <select
                  name="planId"
                  id="planId"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.planId &&
                      formik.errors.planId
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  // onChange={formik.handleChange}
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
                    <span className="font-medium">{formik.errors.planId}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="shiftId"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.shiftId &&
                      formik.errors.shiftId
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Select Shift
                </label>
                <select
                  name="shiftId"
                  id="shiftId"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.shiftId &&
                      formik.errors.shiftId
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  value={formik.values.shiftId}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Shift</option>
                  {SHIFTS.map((shift) => (
                    <option
                      value={shift.id}
                    >
                      {shift.shift_name}
                    </option>
                  ))}
                </select>
                {formik.touched.shiftId && formik.errors.shiftId ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.shiftId}</span>
                  </div>
                ) : null}
              </div>

              <div className="col-span-12">
                <label
                  htmlFor="address"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched.address &&
                      formik.errors.address
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched.address &&
                      formik.errors.address
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                ></textarea>
                {formik.touched.address && formik.errors.address ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.address}</span>
                  </div>
                ) : null}
              </div>

              <div className="col-span-8">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photo"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500
                     ${formik.touched.address &&
                        formik.errors.address
                        ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      }
                    `
                    }
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to upload Profile Image
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="photo"
                      type="file"
                      name="photo"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                  </label>
                </div>
                {formik.touched.photo && formik.errors.photo ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.photo}</span>
                  </div>
                ) : null}
              </div>

              <div className="cols-span-4">
                <img
                  src={previewProfile}
                  alt=""
                  srcset=""
                  className="h-40 min-w-[296px]"
                />
              </div>

              <div className="col-span-4">
                <label
                  htmlFor="membershipStart"
                  className={`block mb-2 text-sm font-medium
                                                ${formik.touched
                      .membershipStart &&
                      formik.errors.membershipStart
                      ? "text-red-900"
                      : "text-gray-900 dark:text-white"
                    }
                                                    `}
                >
                  Membership Starting Date
                </label>
                <input
                  type="date"
                  name="membershipStart"
                  id="membershipStart"
                  className={`border text-sm rounded-lg block w-full p-2.5
                                                ${formik.touched
                      .membershipStart &&
                      formik.errors.membershipStart
                      ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    }
                                                    `}
                  onChange={formik.handleChange}
                  value={formik.values.membershipStart}
                />
                {formik.touched.membershipStart &&
                  formik.errors.membershipStart ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {formik.errors.membershipStart}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-4">
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Membership Ending Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  value={formik.values.endDate}
                  readOnly
                />
              </div>
              <div className="col-span-4 mt-5">
                <input
                  id="isPayment"
                  type="checkbox"
                  defaultValue
                  className="mt-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={formik.handleChange}
                  checked={formik.values.isPayment}
                />

                <label
                  htmlFor="isPayment"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Do You Want to Pay ?
                </label>
                {formik.touched.isPayment && formik.errors.isPayment ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {formik.errors.isPayment}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Payment Parameters */}
              {formik.values.isPayment ? (
                <div className="col-span-4">
                  <label
                    htmlFor="admissionFee"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Admission Fee
                  </label>
                  <input
                    type="text"
                    name="admissionFee"
                    id="admissionFee"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formik.values.admissionFee}
                    readOnly
                  />
                </div>
              ) : null}

              {formik.values.isPayment ? (
                <div className="col-span-4">
                  <label
                    htmlFor="membershipFee"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Membership Fee
                  </label>
                  <input
                    type="text"
                    name="membershipFee"
                    id="membershipFee"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formik.values.membershipFee}
                    readOnly
                  />
                </div>
              ) : null}

              {formik.values.isPayment ? (
                <div className="col-span-4">
                  <label
                    htmlFor="payableAmt"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Payable Amount
                  </label>
                  <input
                    type="text"
                    name="payableAmt"
                    id="payableAmt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value={formik.values.payableAmt}
                    readOnly
                  />
                </div>
              ) : null}
              {/* Payment Parameters */}

              <div className="col-span-12">
                <input
                  id="tac"
                  type="checkbox"
                  defaultValue
                  className="mt-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={formik.handleChange}
                  checked={formik.values.tac}
                />
                <label
                  htmlFor="tac"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Agree{" "}
                  <a className="text-blue-800" href="terms-and-conditions">
                    Terms and Conditions
                  </a>
                </label>
                {formik.touched.tac && formik.errors.tac ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.tac}</span>
                  </div>
                ) : null}
              </div>
              <div className="col-span-12">
                <div class="bg-white float-right">
                  <Button type="submit">
                    <FontAwesomeIcon icon={faUser} className="mr-1" /> Save
                    Member
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddMember;
