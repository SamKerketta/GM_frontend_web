import {
  faCamera,
  faUser,
  faUsers,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  API_BASE_URL,
  AUTH_TOKEN,
  CURRENT_DATE,
  SUPPORTED_FORMATS,
} from "../../config/utilities";
import { useEffect, useRef, useState } from "react";
import { Button } from "flowbite-react";
import {
  captureImage,
  handleFileChange,
  handleValidation,
  startStreaming,
  stopCamera,
} from "../../Services/Utils";
import axios from "axios";
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";

const EditMember = () => {
  const location = useLocation();
  const data = location.state;
  const currentDate = CURRENT_DATE;
  const updateMemberApi = `${API_BASE_URL}/crud/member/update-member`;
  const [loader, setLoader] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [previewProfile, setPreviewProfile] = useState(
    data.memberDtls.photo_url
  );

  const formik = useFormik({
    initialValues: {
      id: data.memberDtls?.id,
      name: data.memberDtls?.name,
      email: data.memberDtls?.email,
      phone: data.memberDtls?.phone,
      dob: data.memberDtls?.dob,
      gender: data.memberDtls?.gender?.toLowerCase(),
      address: data.memberDtls?.address,
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Please Enter This Field"),
      email: Yup.string()
        .email("Invalid Email Address")
        .max(50, "Must be 50 characters or less"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be Valid Number")
        .required("Please Enter This Field"),
      dob: Yup.date().max(new Date(), "Date Range can not be in future"),
      gender: Yup.string()
        .oneOf(["male", "female"], 'Gender must be either "Male" or "Female"')
        .required("Please Enter This Field"),
      address: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Please Enter This Field"),
      photo: Yup.mixed()
        .nullable()
        .test("fileType", "Only JPG/PNG files are allowed", (value) => {
          if (!value) return true; // Allow null or undefined
          console.log(value.type);
          return SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", "File size too large (max 2MB)", (value) => {
          if (!value) return true; // Allow null or undefined
          return value.size <= 2 * 1024 * 1024; // 2MB
        }),
    }),
    onSubmit: (values, { resetForm }) => {
      submitMember(values, resetForm);
    },
  });

  useEffect(() => {
    startStreaming(streaming, videoRef, navigator, setStreaming);
  }, [streaming]);

  const startCamera = async () => {
    setStreaming(true);
  };

  //   Submit Member
  // Submit Members api call
  const submitMember = async (payload, resetForm) => {
    setLoader(true);
    try {
      await axios
        .post(`${updateMemberApi}`, payload, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const apiData = response.data;
            if (apiData.status === true) {
              SuccessToast.show(apiData.message);
              resetForm();
              navigate("/members");
            }
            if (apiData.status === false) {
              throw apiData;
            }
          } else {
            throw response.data.message;
          }
        });
    } catch (error) {
      if (error.isAxiosError) {
        handleValidation(error.response.data.errors);
      } else {
        ErrorToast.show("Something Went Wrong");
      }
    } finally {
      setLoader(false);
    }
  };

  //   JSX
  return (
    <>
      <div class="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faUsers} /> Edit Member
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
                                                ${
                                                  formik.touched.name &&
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
                                                ${
                                                  formik.touched.name &&
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
                                                ${
                                                  formik.touched.email &&
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
                                                ${
                                                  formik.touched.email &&
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
                                                ${
                                                  formik.touched.phone &&
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
                                                ${
                                                  formik.touched.phone &&
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
                                                ${
                                                  formik.touched.dob &&
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
                                                ${
                                                  formik.touched.dob &&
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
                                                ${
                                                  formik.touched.gender &&
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
                                                ${
                                                  formik.touched.gender &&
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

              <div className="col-span-12">
                <label
                  htmlFor="address"
                  className={`block mb-2 text-sm font-medium
                                                ${
                                                  formik.touched.address &&
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
                                                ${
                                                  formik.touched.address &&
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

              <div className="col-span-7">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photo"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500
                     ${
                       formik.touched.address && formik.errors.address
                         ? "bg-red-50 border-red-500 placeholder-red-700 text-red-900 focus:ring-red-500 focus:border-red-500 dark:bg-red-600 dark:border-red-500 dark:placeholder-red-300 dark:text-white"
                         : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                     }
                    `}
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
                      onChange={(e) =>
                        handleFileChange(e, setPreviewProfile, formik)
                      }
                    />
                  </label>
                </div>
                {formik.touched.photo && formik.errors.photo ? (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">{formik.errors.photo}</span>
                  </div>
                ) : null}
              </div>

              <div className="col-span-1">
                {!capturedImage && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <FontAwesomeIcon icon={faCamera} size="xl" />
                  </button>
                )}

                {capturedImage && (
                  <button
                    onClick={removeImage}
                    className="p-4 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faVideoSlash} size="xl" />
                  </button>
                )}
              </div>

              {streaming && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                  <div className="relative bg-white rounded-lg p-4 shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-[90vw] max-w-[600px] h-auto rounded"
                    />

                    <div className="flex justify-center mt-4 gap-4">
                      <button
                        onClick={() =>
                          captureImage(
                            videoRef,
                            canvasRef,
                            setCapturedImage,
                            setPreviewProfile,
                            setFileBlob,
                            setStreaming
                          )
                        }
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Capture
                      </button>
                      <button
                        onClick={() => {
                          stopCamera(videoRef, setStreaming);
                        }}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              <div className="cols-span-5">
                <img
                  src={previewProfile}
                  alt=""
                  srcset=""
                  className="h-40 min-w-[350px]"
                />
              </div>
              <div className="col-span-12">
                <hr />
              </div>
              <div className="col-span-12">
                <div class="bg-white float-right">
                  <Button type="submit" disabled={loader}>
                    <FontAwesomeIcon icon={faUser} className="mr-1" /> Save
                    Changes
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

export default EditMember;
