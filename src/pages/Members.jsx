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
import { Button, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Link } from "react-router-dom";
import SuccessToast from "../components/SuccessToast";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons/faMoneyCheckDollar";
import WidgetLoader from "../components/WidgetLoader";
import { Modal } from "flowbite-react";
import { isNullOrEmpty } from "../Services/Utils";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

// Members api
const memberListApi = `${API_BASE_URL}/crud/member/list-member`;

/**
 * Things to do
 * 1. Search by name,mobile,due members
 */

const Members = () => {
  const [membersList, setMembersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [reloadMembers, setreloadMembers] = useState(false);
  const planListApi = `${API_BASE_URL}/crud/plans/list`;
  const [plans, setPlans] = useState([]);
  const [notifiedId, setNotifiedId] = useState(null);
  const [profilePic, setProfilePic] = useState(false);
  const [profilePath, setProfilePath] = useState();
  const [memberName, setMemberName] = useState();
  const [searchMember, setSearchMember] = useState();
  const [searchMemberStatus, setSearchMemberStatus] = useState(false);
  const [searchDueStatus, setSearchDueStatus] = useState();

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

  // use Effect
  useEffect(() => {
    fetchMembers(currentPage);
  }, [searchDueStatus]);

  // use Effect
  useEffect(() => {
    if (reloadMembers) {
      fetchMembers(currentPage);
    }
  }, [reloadMembers]);

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
  const fetchMembers = async (page, perPageSize = perPage) => {
    setLoader(true);
    try {
      await axios
        .post(`${memberListApi}`, {
          page: page,
          perPage: perPageSize,
          name: searchMember,
          dueStatus: searchDueStatus,
        })
        .then((response) => {
          if (response.status === 200) {
            const apiData = response.data;
            if (apiData.status === true) {
              setTotalRows(apiData.data.total); // total number of records
              setCurrentPage(apiData.data.current_page); // update current page
              setMembersList(apiData.data.data);
            }
          } else {
            ErrorToast.show(response.data.message);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
      setreloadMembers(false);
    }
  };

  // Send Whatsapp msg
  const sendWhatsappMsg = async (memberId) => {
    setNotifiedId(memberId);
    try {
      await axios
        .post(`${API_BASE_URL}/send-whatsapp`, {
          memberId: memberId,
        })
        .then((response) => {
          if (response.data.status == false) {
            ErrorToast.show(response.data.message);
          }

          if (response.data.status) {
            SuccessToast.show(response.data.message);
          }
        });
    } catch {
      ErrorToast.show("Oops Something Went Wrong");
    } finally {
      // setNotifiedId(null);
    }
  };

  //
  const openProfilePic = (row) => {
    const photoUrl = isNullOrEmpty(row.photo_url)
      ? "https://whitedotpublishers.com/wp-content/uploads/2022/05/male-placeholder-image.jpeg"
      : row.photo_url;
    setProfilePath(photoUrl);
    setMemberName(row.name);
    setProfilePic(true);
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Member's Name",
      cell: (row, index) => (
        <>
          <div className="cursor-pointer" onClick={() => openProfilePic(row)}>
            {row.name}
          </div>
        </>
      ),
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
      name: "Shift",
      selector: (row) => row.shift_name,
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
      name: "Arrear",
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
            disabled={notifiedId === row.id}
            onClick={() => sendWhatsappMsg(row.id)}
          >
            {notifiedId === row.id ? (
              <FontAwesomeIcon icon={faCircleCheck} size="2x" />
            ) : (
              <svg
                class="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 21"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM1.866 8.832a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"
                ></path>
              </svg>
            )}
          </Button>

          {/* Danger Button */}
          <Link
            state={{
              memberId: row.id,
              plans: plans,
            }}
            to="/member-payment"
            type="button"
            className="px-2 py-2 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 inline-flex items-center"
          >
            <FontAwesomeIcon icon={faMoneyCheckDollar} size="2x" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div class="grid grid-cols-12 gap-4 p-2">
        {/* Add Members Option */}
        <div class="col-span-3">
          <Link
            to="/add-member"
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <FontAwesomeIcon icon={faUser} /> Add Member
          </Link>
        </div>
        {/* Add Members Option */}

        {/* Search Filterations */}
        <div className="col-span-3">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faUsers} /> Members List
          </h2>
        </div>

        <div className="col-span-3"></div>
        {/* Search filterations */}
        <div className="col-span-3">
          <div className="flex">
            <Dropdown
              label="DueStatus"
              renderTrigger={() => (
                <button
                  type="button"
                  className="whitespace-nowrap inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                >
                  Due Filter
                  <svg
                    className="w-4 h-4 ml-2"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              disabled={loader}
            >
              <DropdownItem onClick={() => setSearchDueStatus(1)}>
                Dues
              </DropdownItem>
              <DropdownItem onClick={() => setSearchDueStatus(0)}>
                No Dues
              </DropdownItem>
            </Dropdown>

            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Search Name/Phone"
                onChange={(e) => setSearchMember(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setreloadMembers(true)}
                disabled={loader}
                className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        </div>

        <div className="col-span-12">
          <DataTable
            fixedHeader
            columns={columns}
            data={membersList}
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
            Total Members: <span className="font-semibold">{totalRows}</span>
          </div>
        </div>
      </div>

      {/* Modal open for the profile pic image */}
      <Modal
        show={profilePic}
        onClose={() => setProfilePic(false)}
        dismissible={true}
      >
        <ModalHeader>{memberName}</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <img src={profilePath} alt="" srcset="" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setProfilePic(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Members;
