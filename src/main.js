import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTaskHub from "./pages/task_hub/MainTaskHub";
import MainTimer from "./pages/timer/Timer";
import ListTaskMain from "./listTasks/ListTaskMain";
import MainAIAdvice from "./pages/ai_advice/MainAIAdvice";
import MainWelcome from "./pages/welcome/MainWelcome";

const Main = () => {
  MainWelcome();
  MainTaskHub();
  MainAIAdvice();
  MainDashboard();
  MainTimer();
  ListTaskMain();
};

export default Main;
