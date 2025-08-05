import openNotification from "./toastNotifications";

const APIErrorController = (error, customMsg = "") => {
  let message = "";
  let type = "error";

  if (customMsg) message = customMsg;
  else if (
    error?.status === 401 &&
    error?.response?.data?.message === "Unauthorized"
  ) {
    type = "info";
    message =
      "Your session has expired, please sign in again. or create a new account.";
  } else if (
    [404, 401, 409].includes(error?.status) &&
    error?.response?.data?.error
  )
    message = error.response.data.error;
  else if (error.message === "Network Error")
    message = "Fetching data failed. Please check your internet connection!";
  else {
    message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";
  }

  openNotification(type, message);
};

export default APIErrorController;
