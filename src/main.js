import MainAIAdvice from "./pages/ai_advice/MainAIAdvice";
import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTaskHub from "./pages/task_hub/MainTaskHub";
import MainTimer from "./pages/timer/MainTimer";
import MainWelcome from "./pages/welcome/MainWelcome";
import SendSuggestionMain from "./services/send_Sug";

const Main = () => {
  MainWelcome();
  MainTaskHub();
  MainAIAdvice();
  MainDashboard();
  MainTimer();
  SendSuggestionMain();
};

export default Main;
