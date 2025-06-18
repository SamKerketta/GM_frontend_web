import DataTable from "react-data-table-component";
import WidgetLoader from "../components/WidgetLoader";
import { useEffect, useState } from "react";
import { API_BASE_URL, AUTH_TOKEN } from "../config/utilities";
import axios from "axios";
import ErrorToast from "../components/ErrorToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useFormik } from "formik";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Plans = () => {
  const [loader, setLoader] = useState(false);
  const aPlansList = API_BASE_URL + "/crud/plans/list";
  const [plansList, setPlansList] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      planName: "",
      duration: 1,
      price: "",
      description: "",
      admissionFee: "",
    },
  });

  useEffect(() => {
    fetchPlansList();
  }, []);

  const fetchPlansList = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        aPlansList,
        {},
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.status) {
          setPlansList(response.data.data);
        } else {
          throw response.data.message;
        }
      }

      if (response.status != 200) {
        throw "Something Went Wrong";
      }
    } catch (error) {
      ErrorToast.show(error);
    } finally {
      setLoader(false);
    }
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Plan Name",
      selector: (row, index) => row.plan_name,
      sortable: true,
      width: "450px",
    },
    {
      name: "Plan Price",
      selector: (row, index) => row.price,
      sortable: true,
      width: "300px",
    },
    {
      name: "Duration (In Months)",
      selector: (row, index) => row.duration,
      sortable: true,
      width: "300px",
    },
    {
      name: "Gym Fee",
      selector: (row, index) => row.admission_fee,
      sortable: true,
      width: "300px",
    },

    {
      name: "Action",
      button: true,
      cell: (row) => (
        <div className="flex gap-1 m-2">
          <ButtonGroup>
            <Button color="alternative" onClick={() => setOpenModal(true)}>
              <FontAwesomeIcon icon={faPenToSquare} className="text-blue-500" />
            </Button>
            <Button color="alternative">
              <FontAwesomeIcon icon={faTrash} className="text-red-500" />
            </Button>
          </ButtonGroup>
        </div>
      ),
    },
  ];
  return (
    <>
      <div class="grid grid-cols-12 gap-4">
        {/* Add Plans Option */}
        <div class="col-span-3">
          <Button
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => setOpenModal(true)}
          >
            <FontAwesomeIcon icon={faDumbbell} /> Add Plans
          </Button>
        </div>
        {/* Add Plans Option */}

        {/* Search Filterations */}
        <div className="col-span-3">
          <h2 class="mb-4 text-3xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl dark:text-white float-right">
            <FontAwesomeIcon icon={faDumbbell} /> Plans List
          </h2>
        </div>

        <div className="col-span-12">
          <DataTable
            fixedHeader
            columns={columns}
            data={plansList}
            pagination
            paginationRowsPerPageOptions={[10, 20, 50]}
            progressPending={loader}
            highlightOnHover
            pointerOnHover
            progressComponent={<WidgetLoader />}
          />
        </div>

        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          fullWidth
          maxWidth="sm" // Options: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
          slotProps={{
            paper: {
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                const email = formJson.email;
                console.log(email);
                setOpenModal(false);
              },
            },
          }}
        >
          <DialogTitle>Add Plans</DialogTitle>
          <DialogContent>
            <DialogContentText>Add Your Membership Plan</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="planName"
              name="planName"
              label="Plan Name"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Plans;
