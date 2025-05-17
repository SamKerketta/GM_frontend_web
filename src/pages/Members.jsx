import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { faCreditCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../config/utilities";
import axios from "axios";
import ErrorToast from "../components/ErrorToast";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import AddMember from "../assets/forms/AddMember";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

// Members api 
const memberListApi = `${API_BASE_URL}/crud/member/list-member`;

const Members = () => {

  const [membersList, setMembersList] = useState([])
  const [loader, setLoader] = useState(false)
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openMemberModal, setOpenMemberModal] = useState(false);

  // use Effect
  useEffect(() => {
    fetchMembers(currentPage);
  }, [])

  // Function to handle page changes
  const handlePageChange = (page) => {
    fetchMembers(page);
  };

  // Handle per page row changes
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchMembers(page, newPerPage);
  };

  // Function to get all the members
  const fetchMembers = (page, perPageSize = perPage) => {
    setLoader(true)
    try {
      axios.post(`${memberListApi}`, {
        page: page,
        perPage: perPageSize
      })
        .then((response) => {
          if (response.status === 200) {
            const apiData = response.data;
            if (apiData.status === true) {
              setTotalRows(apiData.data.total);              // total number of records
              setCurrentPage(apiData.data.current_page);     // update current page
              setMembersList(apiData.data.data)
            }
          } else {
            ErrorToast.show(response.data.message)
          }
        })
    } catch (error) {
      console.error(error)
    } finally {
      setLoader(false)
    }

  }

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Member's Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Member's Contact",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Date Of Joining",
      selector: (row) => row.membership_start,
      sortable: true,
    },
    {
      name: "Dues Status",
      cell: (row, index) => (
        <>
          {row.due_status !== 0 ? (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              Dues
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              No Dues
            </span>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Due Months",
      cell: (row, index) => (
        <>
          {row.months_due > 0 ? (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              {row.months_due}
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              0
            </span>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.membership_end,
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
            className="px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 21">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM1.866 8.832a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"></path>
            </svg>
          </Button>

          {/* Danger Button */}
          <Button
            type="button"
            className="px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 inline-flex items-center"
          >
            <FontAwesomeIcon icon={faCreditCard} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div class="grid grid-cols-12 gap-4 p-2">
        <div className="col-span-6">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faUsers} /> Members List
          </h2>
        </div>
        <div class="col-span-6">
          <button
            type="button"
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right"
            onClick={() => setOpenMemberModal(true)}
          >
            <FontAwesomeIcon icon={faUser} /> Add Member
          </button>
        </div>

        <div className="col-span-12">
          <DataTable fixedHeader
            columns={columns}
            data={membersList}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationRowsPerPageOptions={[10, 20, 50]}
            progressPending={loader}
          />
        </div>
      </div>

      <AddMember
        openMemberModal={openMemberModal}
        setOpenMemberModal={setOpenMemberModal}
      />

    </>
  );
};

export default Members;
