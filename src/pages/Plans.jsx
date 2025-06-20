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
import { Box, FormHelperText } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import * as Yup from "yup";
import SuccessToast from "../components/SuccessToast";
import { handleValidation } from "../Services/Utils";

const Plans = () => {
  const [loader, setLoader] = useState(false);
  const aPlansList = API_BASE_URL + "/crud/plans/list";
  const [plansList, setPlansList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formik = useFormik({
    initialValues: {
      planName: "",
      duration: 1,
      price: "",
      description: "",
      admissionFee: 0,
    },
    validationSchema: Yup.object({
      planName: Yup.string().required("Please Enter This Field"),
      description: Yup.string().nullable(),
      price: Yup.number()
        .required("Please Enter The Price")
        .min(1)
        .typeError("Please enter a valid number"), // for non-numeric strings,
      admissionFee: Yup.number()
        .required("Please Enter The Price")
        .min(0)
        .typeError("Please enter a valid number"), // for non-numeric strings,,
      duration: Yup.number("Please Enter a valid duration")
        .required("Please Enter This Field")
        .min(0)
        .typeError("Please enter a valid number"), // for non-numeric strings,,
    }),
    onSubmit: (values, { resetForm }) => {
      submitPlan(values);
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

  const increase = () => {
    const changedValue = Number(formik.values.duration) + 1;
    formik.setFieldValue("duration", changedValue);
  };

  const decrease = () => {
    const changedValue =
      Number(formik.values.duration) > 1
        ? Number(formik.values.duration) - 1
        : 1;
    formik.setFieldValue("duration", changedValue);
  };

  const submitPlan = async (payload) => {
    setLoader(true);
    try {
      const response = await axios.post(
        API_BASE_URL + "/crud/plans/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      if (response.status == 200) {
        if (response.data.status) {
          SuccessToast.show(response.data.message);
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
  };

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
                formik.handleSubmit();
              },
            },
          }}
        >
          <DialogTitle>Add Plans</DialogTitle>
          <DialogContent>
            <DialogContentText>Add Your Membership Plan</DialogContentText>
            {/* <form onSubmit={formik.handleSubmit}> */}
            <TextField
              error={formik.touched.planName && Boolean(formik.errors.planName)}
              autoFocus
              margin="dense"
              id="planName"
              name="planName"
              label="Plan Name"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.planName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.planName && Boolean(formik.errors.planName)
                  ? formik.errors.planName
                  : ""
              }
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && Boolean(formik.errors.description)
                  ? formik.errors.description
                  : ""
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            <Box display="flex" gap={2}>
              <TextField
                margin="dense"
                id="price"
                name="price"
                label="Plan Price"
                type="text"
                fullWidth
                variant="standard"
                sx={{ flex: 1 }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={
                  formik.touched.price && Boolean(formik.errors.price)
                    ? formik.errors.price
                    : ""
                }
                value={formik.values.price}
              />
              <TextField
                margin="dense"
                id="admissionFee"
                name="admissionFee"
                label="Admission Fee"
                type="text"
                fullWidth
                variant="standard"
                sx={{ flex: 1 }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.admissionFee &&
                  Boolean(formik.errors.admissionFee)
                }
                helperText={
                  formik.touched.admissionFee &&
                  Boolean(formik.errors.admissionFee)
                    ? formik.errors.admissionFee
                    : ""
                }
                value={formik.values.admissionFee}
              />
            </Box>

            <div className="flex items-center space-x-2 mt-3">
              <Button
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-3"
                size="md"
                onClick={decrease}
              >
                -
              </Button>
              <FormControl
                className="w-[20%]"
                sx={{ m: 1 }}
                variant="standard"
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
              >
                <InputLabel htmlFor="duration">
                  Duration(<span className="text-yellow-400">In Months</span>)
                </InputLabel>
                <Input
                  id="duration"
                  name="duration"
                  min="1"
                  value={formik.values.duration}
                  onChange={
                    ((e) => setQuantity(Number(e.target.value)),
                    formik.handleChange)
                  }
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.duration && Boolean(formik.errors.duration)
                  }
                  helperText={
                    formik.touched.duration && Boolean(formik.errors.duration)
                      ? formik.errors.duration
                      : ""
                  }
                />
                {formik.touched.duration && formik.errors.duration && (
                  <FormHelperText className="text-red-600">
                    {formik.errors.duration}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mt-3"
                size="md"
                onClick={increase}
              >
                +
              </Button>
            </div>
            {/* </form> */}
          </DialogContent>
          <DialogActions>
            <Button
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              type="submit"
              disabled={loader}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Plans;
