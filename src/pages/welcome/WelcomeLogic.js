import openNotification from "../../services/toastNotifications";

const WelcomeLogic = () => {
  const welcomeContainerEl = document.querySelector(".welcome-page");

  if (welcomeContainerEl) {
    const getSuggestionsFormDiv = document.querySelector(
      ".get-suggestions-form_div"
    );

    welcomeContainerEl.addEventListener("click", (event) => {
      if (event.target.closest("#how-works_btn")) {
        openNotification("success", "You will recieve the guides via email!");
      }

      if (event.target.closest("#feedback-icon-div"))
        getSuggestionsFormDiv.style.display = "block";

      if (event.target.closest("#send_btn"))
        getSuggestionsFormDiv.style.display = "none";

      if (event.target.closest("#cancel_btn"))
        getSuggestionsFormDiv.style.display = "none";
    });
  }
};

export default WelcomeLogic;
