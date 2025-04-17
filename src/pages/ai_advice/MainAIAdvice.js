import openNotification from "../../services/toastNotifications";

const MainAIAdvice = () => {
  const aiAdviceLinkEl = document.getElementById("ai_advice-link");
  aiAdviceLinkEl.addEventListener("click", () =>
    openNotification("info", "This feature is coming soon! Stay tuned!")
  );
};

export default MainAIAdvice;
