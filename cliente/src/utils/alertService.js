import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const toastDefaults = {
  toast: true,
  position: "top-end",
  timer: 3500,
  timerProgressBar: true,
  showConfirmButton: false,
  customClass: {
    popup: "swal2-borderless",
  },
};

export const notifySuccess = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "success",
    title: message,
  });
};

export const notifyError = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "error",
    title: message,
  });
};

export const notifyInfo = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "info",
    title: message,
  });
};

export const notifyWarning = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "warning",
    title: message,
  });
};

export const confirmAction = (options) => {
  return Swal.fire({
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
    ...options,
  });
};
