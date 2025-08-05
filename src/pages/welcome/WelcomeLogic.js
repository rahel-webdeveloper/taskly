import SendSuggestionMain from "../../services/send_feedback-logic";
import openNotification from "../../services/toastNotifications";

export const WelcomeLogic = () => {
  const welcomeContainerEl = document.querySelector(".welcome-page");

  if (welcomeContainerEl)
    welcomeContainerEl.addEventListener("click", (event) => {
      // Send guidance to user

      if (event.target.closest("#how-works_btn"))
        openNotification("success", "Check out the guide to get started!");
    });

  SendSuggestionMain();
};

export default WelcomeLogic;
