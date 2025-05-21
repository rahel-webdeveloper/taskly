import openNotification from "../../services/toastNotifications";
import emailjs from "@emailjs/browser";
import { SERVICE_ID, TEMPLATE_ID, templateParams } from "./store";
import { sendSuggestions } from "../../services/send-suggesstion";

const WelcomeLogic = () => {
  const welcomeContainerEl = document.querySelector(".welcome-page");

  if (welcomeContainerEl) {
    const getSuggestionsFormDiv = document.querySelector(
      ".get-suggestions-form_div"
    );

    const getSuggestionsStyle = getSuggestionsFormDiv.style;

    const getSuggestionsForm = document.getElementById("get-suggestions-form");

    welcomeContainerEl.addEventListener("click", (event) => {
      if (event.target.closest("#how-works_btn")) {
        openNotification("success", "You will recieve the guides very soon!");
      }

      if (event.target.closest("#feedback-icon-div"))
        getSuggestionsStyle.display = "block";

      if (event.target.closest("#send_btn"))
        !validationOfGetSuggestionsForm() &&
          openNotification("warning", "Please fill out the form correctly!");

      if (event.target.closest("#cancel_btn")) {
        getSuggestionsStyle.display = "none";

        openNotification("error", "You cancelled the feedback form.");
      }
    });

    getSuggestionsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      getSuggestionsStyle.display = "none";

      this.reset();

      sendSuggestions(templateParams.get());
    });
  }
};

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

export default WelcomeLogic;
