import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faReceipt } from "@fortawesome/free-solid-svg-icons/faReceipt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Invoice from "../components/Invoice";
import { API_BASE_URL, CURRENT_DATE } from "../config/utilities";
import axios from "axios";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import PageLoader from "../components/PageLoader";
import WidgetLoader from "../components/WidgetLoader";

const Transactions = () => {
  const [loader, setLoader] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // const [startDate, setStartDate] = useState(CURRENT_DATE);
  const [startDate, setStartDate] = useState("2025-05-21");
  const [endDate, setEndDate] = useState(CURRENT_DATE);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [tranId, setTranId] = useState();

  useEffect(() => {
    fetchTransactions(currentPage, perPage);
  }, []);

  const fetchTransactions = async (page, perPageSize = perPage) => {
    const token = localStorage.getItem("authToken");
    setLoader(true);
    try {
      await axios
        .post(
          `${API_BASE_URL}/report/payment-report`,
          {
            startDate: startDate,
            endDate: endDate,
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
              console.log("transactions ==================", transactions);
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
              setTranId(row.id);
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
        <div className="col-span-6">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faCreditCard} /> Transactions
          </h2>
        </div>
        <div className="col-span-12">
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        </div>

        <div className="col-span-12">
          <DataTable
            fixedHeader
            columns={columns}
            data={transactions}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationRowsPerPageOptions={[10, 20, 50]}
            progressPending={loader}
            progressComponent={<WidgetLoader />}
          />
        </div>
      </div>

      {/* Modal  */}
      <Invoice openModal={openInvoice} setOpenModal={setOpenInvoice} />
    </>
  );
};

export default Transactions;
