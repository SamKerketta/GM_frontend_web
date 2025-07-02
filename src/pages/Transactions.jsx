import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faReceipt } from "@fortawesome/free-solid-svg-icons/faReceipt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Invoice from "../components/Invoice";
import { API_BASE_URL, CURRENT_DATE } from "../config/utilities";
import axios from "axios";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import PageLoader from "../components/PageLoader";
import WidgetLoader from "../components/WidgetLoader";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import jsPDF from "jspdf";

const Transactions = () => {
  const [loader, setLoader] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [tranId, setTranId] = useState();
  const [filterStartDate, setFilterStartDate] = useState();
  const [filterEndDate, setFilterEndDate] = useState();
  const [filterRecipient, setFilterRecipient] = useState();
  const [totalAmount, setTotalAmount] = useState();

  const formik = useFormik({
    initialValues: {
      paymentFrom: null,
      paymentTo: null,
      recipientName: null,
    },
    validationSchema: Yup.object({
      paymentFrom: Yup.date().nullable(),
      paymentTo: Yup.date()
        .nullable()
        .test(
          "is-after",
          "Payment To must be after or equal to Payment From",
          function (value) {
            const { paymentFrom } = this.parent;
            if (!value || !paymentFrom) return true; // skip if either is empty
            return value >= paymentFrom;
          }
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      setFilterRecipient(values.recipientName);
    },
  });

  useEffect(() => {
    fetchTransactions(currentPage, perPage);
  }, [filterStartDate, filterEndDate, filterRecipient]);

  useEffect(() => {
    console.log(formik.values);
    if (formik.values.paymentFrom && formik.values.paymentTo) {
      const startDate = format(formik.values.paymentFrom, "yyyy-MM-dd");
      const endDate = format(formik.values.paymentTo, "yyyy-MM-dd");
      if (endDate >= startDate) {
        setFilterStartDate(startDate);
        setFilterEndDate(endDate);
      }
    }
  }, [formik.values.paymentFrom, formik.values.paymentTo]);

  const fetchTransactions = async (page, perPageSize = perPage) => {
    const token = localStorage.getItem("authToken");
    setLoader(true);
    try {
      await axios
        .post(
          `${API_BASE_URL}/report/payment-report`,
          {
            startDate: filterStartDate,
            endDate: filterEndDate,
            name: filterRecipient,
            page: page,
            perPage: perPageSize,
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
              setTransactions(response.data.data.data.data);
              setTotalRows(response.data.data.data.total); // total number of records
              setCurrentPage(response.data.data.data.current_page); // update current page
              setTotalAmount(response.data.data.total_amount ?? 0);
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
      ErrorToast.show(error.message);
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Invoice No",
      selector: (row) => row.invoice_no,
      sortable: true,
    },
    {
      name: "Recipient Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Payment For",
      cell: (row) => (
        <div>
          {row.payment_for == "plan" ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              Plans
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              Arrear
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Payment Amount",
      cell: (row) => (
        <div>
          <FontAwesomeIcon className="text-green-500" icon={faArrowDown} />{" "}
          <span className="text-green-500">{row.amount_paid}</span>
        </div>
      ),
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    {
      name: "Plan From",
      selector: (row) => row.month_from,
      sortable: true,
    },
    {
      name: "Plan To",
      selector: (row) => row.month_till,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.month_till,
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <div className="flex gap-1 m-2">
          {/* Info Button */}
          <Button
            type="button"
            className="text-white bg-red-700 rounded-full hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 inline-flex items-center"
            onClick={() => {
              setTranId(row.transaction_id);
              setOpenInvoice(true);
            }}
          >
            <FontAwesomeIcon icon={faReceipt} title="Invoice" />
          </Button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page) => {
    fetchTransactions(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchTransactions(page, newPerPage);
  };

  return (
    <>
      <div class="grid grid-cols-12 gap-4 p-2">
        <div className="col-span-3">
          <div className="flex rounded-md shadow-sm">
            <Tooltip
              content="Select Payment From"
              style="light"
              placement="top"
            >
              <DatePicker
                data-tooltip-target="start-date-tooltip"
                data-tooltip-style="light"
                selected={formik.values.paymentFrom}
                placeholderText="Select Start date"
                className="border p-2 rounded"
                dateFormat="dd-MM-yyyy"
                isClearable
                maxDate={CURRENT_DATE}
                onChange={(date) => formik.setFieldValue("paymentFrom", date)}
                onBlur={formik.handleBlur}
              />

              {formik.touched.paymentFrom && formik.errors.paymentFrom ? (
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">{formik.errors.paymentFrom}</span>
                </p>
              ) : null}
            </Tooltip>
            <Tooltip content="Select Payment To" style="light" placement="top">
              <DatePicker
                data-tooltip-target="start-date-tooltip"
                data-tooltip-style="light"
                selected={formik.values.paymentTo}
                onChange={(date) => formik.setFieldValue("paymentTo", date)}
                placeholderText="Select End date"
                minDate={formik.values.paymentFrom}
                className="border p-2 rounded"
                dateFormat="dd-MM-yyyy"
                isClearable
                maxDate={CURRENT_DATE}
                onBlur={formik.handleBlur}
              />
              {formik.touched.paymentTo && formik.errors.paymentTo ? (
                <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">{formik.errors.paymentTo}</span>
                </p>
              ) : null}
            </Tooltip>
          </div>
        </div>

        <div className="col-span-3">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faCreditCard} /> Transactions
          </h2>
        </div>

        <div className="col-span-3"></div>

        <div className="col-span-3">
          <form onSubmit={formik.handleSubmit}>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="recipientName"
                name="recipientName"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Recipient"
                value={formik.values.recipientName}
                onChange={formik.handleChange}
              />
              <button
                type="submit"
                class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4 text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-12">
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        </div>

        <div className="col-span-12">
          <DataTable
            columns={columns}
            data={transactions}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationRowsPerPageOptions={[10, 20, 50]}
            progressPending={loader}
            highlightOnHover
            pointerOnHover
            progressComponent={<WidgetLoader />}
          />
          <div className="p-2 border-t bg-gray-50 text-right">
            Total Amount: <span className="font-semibold">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Modal  */}
      <Invoice
        openModal={openInvoice}
        setOpenModal={setOpenInvoice}
        tranId={tranId}
      />
    </>
  );
};

export default Transactions;
