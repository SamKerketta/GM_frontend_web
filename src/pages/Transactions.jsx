import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";

const Transactions = () => {
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
      name: "Due Date",
      selector: (row) => row.membership_end,
      sortable: true,
    },
  ];

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
            // data={membersList}
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handlePerRowsChange}
            // paginationRowsPerPageOptions={[10, 20, 50]}
            // progressPending={loader}
          />
        </div>
      </div>
    </>
  );
};

export default Transactions;
