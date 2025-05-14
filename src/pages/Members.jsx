import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";
import React from "react";
import DataTable from "react-data-table-component";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const Members = () => {
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Member Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Date Of Joining",
      selector: (row) => row.dateOfJoining,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
    },
    {
      name: "Action",
      button: true,
      cell: () => (
        <div className="flex gap-1 m-2">
          {/* Info Button */}
          <Button
            type="button"
            className="px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M15.133 10.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V1.1a1 1 0 0 0-2 0v2.364a.944.944 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C4.867 13.018 3 13.614 3 14.807 3 15.4 3 16 3.538 16h12.924C17 16 17 15.4 17 14.807c0-1.193-1.867-1.789-1.867-4.175Z" />
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

  const data = [
    {
      id: 1,
      name: "Beetlejuice",
      dateOfJoining: "1988",
      dueDate: "15-05-2025",
    },
    {
      id: 2,
      name: "Ghostbusters",
      dateOfJoining: "1984",
      dueDate: "16-05-2025",
    },
  ];

  return (
    <>
      <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
        Members List
      </h2>

      <DataTable fixedHeader columns={columns} data={data} pagination />
    </>
  );
};

export default Members;
