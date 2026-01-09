import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  faBell,
  faCheck,
  faCreditCard,
  faPenToSquare,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL, AUTH_TOKEN } from "../config/utilities";
import axios from "axios";
import ErrorToast from "../components/ErrorToast";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import AddMember from "../assets/forms/AddMember";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SuccessToast from "../components/SuccessToast";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons/faMoneyCheckDollar";
import WidgetLoader from "../components/WidgetLoader";
import { Modal } from "flowbite-react";
import { handleValidation, isNullOrEmpty } from "../Services/Utils";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { width } from "@fortawesome/free-solid-svg-icons/faUser";

// Members api
const memberListApi = `${API_BASE_URL}/crud/member/list-member`;

/**
 * Things to do
 * 1. Search by name,mobile,due members
 */

const Members = () => {
  const location = useLocation();
  const [membersList, setMembersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItems, setDeleteItems] = useState({ id: null, planName: "" });
  const aDeletePlan = API_BASE_URL + "/crud/member/delete-member";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(
        `${planListApi}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      )
      .then((response) => {
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
        .post(
          `${memberListApi}`,
          {
            page: page,
            perPage: perPageSize,
            name: searchMember,
            dueStatus: searchDueStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }
        )
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
        .post(
          `${API_BASE_URL}/send-whatsapp`,
          {
            memberId: memberId,
          },
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          }
        )
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

  // Delete the Member

  const submitDeletion = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        aDeletePlan,
        {
          id: deleteItems.id,
        },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.status) {
          SuccessToast.show(response.data.message);
          fetchMembers(currentPage);
          setDeleteModal(false);
        } else {
          throw response.data.message;
        }
      }
      if (response.status != 200) {
        throw "Something Went Wrong";
      }
    } catch (error) {
      if (error.isAxiosError) {
        handleValidation(error.response.data.errors);
      } else {
        ErrorToast.show(error);
      }
    } finally {
      setLoader(false);
    }
    console.log("Item Deleted");
  };

  // Navigation to payment page
  const navigateToPaymentPage = (memberId, currentPage) => {
    navigate("/member-payment", {
      state: {
        memberId: memberId,
        plans: plans,
        currentPage: currentPage,
      },
    });
  };

  // Navigation to Edit Member Page
  const navigateToEditMember = (memberDtls) => {
    navigate("/edit-member", {
      state: {
        memberDtls: memberDtls,
      },
    });
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      sortable: true,
      width: "5%",
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
      width: "15%",
    },
    {
      name: "Member's Contact",
      selector: (row) => row.phone,
      sortable: true,
      width: "10%",
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      width: "7%",
    },
    {
      name: "Shift",
      selector: (row) => row.shift_name,
      sortable: true,
      width: "10%",
    },
    {
      name: "Date Of Joining",
      selector: (row) => row.membership_start,
      sortable: true,
      width: "10%",
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
      width: "10%",
    },
    {
      name: "Arrear",
      cell: (row, index) => (
        <>
          {row.due_balance > 0 ? (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              {Number(row.due_balance)}
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              0
            </span>
          )}
        </>
      ),
      sortable: true,
      width: "8%",
    },
    {
      name: "Due Date",
      selector: (row) => row.membership_end,
      sortable: true,
      width: "10%",
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <div className="flex gap-1 m-2">
          <ButtonGroup>
            <Button
              color="alternative"
              disabled={notifiedId === row.id}
              onClick={() => {
                sendWhatsappMsg(row.id);
              }}
            >
              {notifiedId === row.id ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  size="sm"
                  className="text-green-500"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBell}
                  size="md"
                  className="text-blue-500"
                />
              )}
            </Button>

            <Button
              color="alternative"
              onClick={() => navigateToPaymentPage(row.id, currentPage)}
              className="p-4 text-green-500 hover:text-green-400"
            >
              <FontAwesomeIcon size="md" icon={faMoneyCheckDollar} />
            </Button>
            <Button
              color="alternative"
              className="p-4"
              onClick={() => navigateToEditMember(row)}
            >
              <FontAwesomeIcon
                size="md"
                icon={faPenToSquare}
                className="text-blue-500"
              />
            </Button>
            <Button
              color="alternative"
              className="p-4"
              onClick={() => {
                setDeleteModal(true);
                const selected = { id: row.id, memberName: row.name };
                setDeleteItems(selected);
              }}
            >
              <FontAwesomeIcon
                size="md"
                icon={faTrash}
                className="text-red-500"
              />
            </Button>
          </ButtonGroup>
        </div>
      ),
      width: "15%",
      allowOverflow: true,
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
            paginationDefaultPage={currentPage}
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

      {/* Delete Modal */}
      <Modal
        show={deleteModal}
        size="md"
        onClose={() => setDeleteModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <FontAwesomeIcon icon={faTrash} className="text-red-600 text-2xl" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Member{" "}
              <b>{deleteItems.memberName}</b> ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => submitDeletion()}>
                Yes, I'm sure
              </Button>
              <Button
                color="alternative"
                disabled={loader}
                onClick={() => setDeleteModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Members;
