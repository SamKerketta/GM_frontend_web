// src/components/ErrorToast.js
import { Bounce, toast } from 'react-toastify';

const ErrorToast = {
  show: (message) => {
    toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
  },
};

export default ErrorToast;
