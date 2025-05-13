// src/components/SuccessToast.js
import { toast } from "react-toastify";

const SuccessToast = {
  show: (message) => {
    toast.success(message, {
     position: "top-right",
     autoClose: 2000,
     hideProgressBar: false,
     closeOnClick: false,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "light",
    });
  },
};

export default SuccessToast;
