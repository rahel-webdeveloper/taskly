import openNotification from "./toastNotifications";

const APIErrorController = (error, manualMsg = "") => {
  console.log(error);

  let message = "";
  let type = "error";

  if (error.status === 401 && error.response.data.message === "Unauthorized") {
    type = "info";
    message = "Please sign in to your account or create new one.";
  }

  const isAuthStatus =
    error.status === 404 ||
    error.status === 401 ||
    error.status === 409 ||
    false;

  if (isAuthStatus && error.response.data.error) {
    console.log(error.response.data);
    type = "error";
    message = error.response.data.error;
  }

  if (error.message === "Network Error") {
    type = "error";
    message = "Fetching data faild please check out your internet!";
  }

  openNotification(type, manualMsg || message);
};

export default APIErrorController;
