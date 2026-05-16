import { toast } from "react-toastify";

const base = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (msg) =>
  toast.success(msg, {
    ...base,
    style: {
      background: "#2563eb", // blue-600
      color: "white",
      borderLeft: "5px solid #1d4ed8",
    },
  });

export const showError = (msg) =>
  toast.error(msg, {
    ...base,
    style: {
      background: "#dc2626", // red-600
      color: "white",
      borderLeft: "5px solid #b91c1c",
    },
  });

export const showWarning = (msg) =>
  toast.warn(msg, {
    ...base,
    style: {
      background: "#f59e0b",
      color: "black",
      borderLeft: "5px solid #d97706",
    },
  });