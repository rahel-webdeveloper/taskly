import { atom } from "nanostores";
import openNotification from "./toastNotifications";
import emailjs from "@emailjs/browser";

export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
export const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const emailPattern = /^[^\s@]+@[^\@]+\.[^\s@]+$/;

// Suggestions Params
export const templateParams = atom({
  user_name: "",
  user_email: "",
  user_message: "",
});

// Dynamic UI of Send Suggestions component
const sendFeedbackMain = () => {
  const container = document.querySelector(".send-feedback-container");
  const form = document.getElementById("get-feedback-form");

  if (container && !container.hasListener) {
    container.addEventListener("click", eventsHandler);
    container.hasListener = true;
  }

  if (form && !form.hasListener) {
    form.addEventListener("submit", eventsHandler);
    form.hasListener = true;
  }
};

// ***---- Send feedback events
const eventsHandler = (event) => {
  const sendFeedbackStyle = document.querySelector(
    ".get-feedback-form_div"
  ).style;

  if (event.target.closest("#feedback-icon-div"))
    sendFeedbackStyle.display = "block";

  if (event.target.closest("#send_btn"))
    if (!validationOfFeedbackForm()) {
      openNotification("warning", "Please fill out the form correctly!");
      return;
    }

  if (event.target.closest("#cancel_btn")) sendFeedbackStyle.display = "none";

  if (event.type === "submit") {
    event.preventDefault();

    sendFeedbackStyle.display = "none";
    document.getElementById("get-feedback-form").reset();
    sendFeedback(templateParams.get());
  }
};

// Validate the Suggestion form data
const validationOfFeedbackForm = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const userName = document.getElementById("user_name").value.trim();
    const userEmail = document.getElementById("user_email").value.trim();
    const userMessage = document.getElementById("user_message").value.trim();

    if (
      !userName ||
      !userEmail ||
      !userMessage ||
      !emailPattern.test(userEmail)
    )
      return false;
    else {
      templateParams.set({
        user_name: userName,
        user_email: userEmail,
        user_message: userMessage,
      });

      return true;
    }
  });
};

// Send Suggestion to the selected email through email.js
export const sendFeedback = (params) => {
  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, params)
    .then(() => {
      openNotification("success", "You have successfully sent your feedback!");
    })
    .catch((err) => {
      openNotification(
        "error",
        err?.text || "Something went wrong. Please try again!"
      );
    });
};

export default sendFeedbackMain;
