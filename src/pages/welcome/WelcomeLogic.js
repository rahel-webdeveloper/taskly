import openNotification from "../../services/toastNotifications";

const WelcomeLogic = () => {
  const welcomeContainerEl = document.querySelector(".welcome-page");

  if (welcomeContainerEl) {
    const howWorksBtn = document.getElementById("how-works_btn");

    howWorksBtn.addEventListener("click", () =>
      openNotification("success", "You will recieve the guides via email!")
    );
  }
};

export default WelcomeLogic;
