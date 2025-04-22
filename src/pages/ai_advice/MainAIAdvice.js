import openNotification from "../../services/toastNotifications";
import AIAdviceLogic from "./AIAdviceLogic";

const MainAIAdvice = () => {
  document.addEventListener("DOMContentLoaded", () => {
    // const aiAdviceLinkEl = document.getElementById("ai_advice-link");

    // // aiAdviceLinkEl.addEventListener("click", () =>
    // //   openNotification("info", "This feature is coming soon! Stay tuned!")
    // // );

    AIAdviceLogic();
  });
};

export default MainAIAdvice;
