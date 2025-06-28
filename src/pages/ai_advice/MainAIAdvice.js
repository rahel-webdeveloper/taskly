import openNotification from "../../services/toastNotifications";
import AIAdviceLogic from "./AIAdviceLogic";

const MainAIAdvice = () => {
  document.addEventListener("DOMContentLoaded", () => {
    AIAdviceLogic();
  });
};

export default MainAIAdvice;
