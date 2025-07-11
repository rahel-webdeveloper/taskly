import { atom } from "nanostores";
import openNotification from "./toastNotifications";
import emailjs from "@emailjs/browser";

export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
export const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

// Suggestions Params
export const templateParams = atom({
  user_name: "",
  user_email: "",
  user_message: "",
});

// Dynamic UI of Send Suggestions component
const SendSuggestionMain = () => {
  document
    .querySelector(".send-feedback-container")
    .addEventListener("click", eventsHandler);

  document
    .getElementById("get-feedback-form")
    .addEventListener("submit", eventsHandler);
};

// ***---- Send feedback events
const eventsHandler = (event) => {
  const getSuggestionsStyle = document.querySelector(
    ".get-feedback-form_div"
  ).style;

  if (event.target.closest("#how-works_btn")) {
    openNotification("success", "You will recieve the guides very soon!");
  }

  if (event.target.closest("#feedback-icon-div"))
    getSuggestionsStyle.display = "block";

  if (event.target.closest("#send_btn"))
    !validationOfGetSuggestionsForm() &&
      openNotification("warning", "Please fill out the form correctly!");

  if (event.target.closest("#cancel_btn")) getSuggestionsStyle.display = "none";

  if (event.type === "submit") {
    event.preventDefault();

    getSuggestionsStyle.display = "none";

    document.getElementById("get-feedback-form").reset();

    sendFeedback(templateParams.get());
  }
};

// Validate the Suggestion form data
const validationOfGetSuggestionsForm = () => {
  const userName = document.getElementById("user_name").value.trim();
  const userEmail = document.getElementById("user_email").value.trim();
  const userMessage = document.getElementById("user_message").value.trim();

  if (!userName || !userEmail || !userMessage) return false;
  else {
    templateParams.set({
      user_name: userName,
      user_email: userEmail,
      user_message: userMessage,
    });

    return true;
  }
};

// Send Suggestion to the selected email through email.js
export const sendFeedback = (params) => {
  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, params)
    .then((res) => {
      openNotification("success", "You have successfully sent your feedback!");
    })
    .catch((err) => {
      openNotification("error", err);
    });
};

export default SendSuggestionMain;
