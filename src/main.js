import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTaskHub from "./pages/task_hub/MainTaskHub";
import MainTimer from "./pages/timer/Timer";
import ListTaskMain from "./listTasks/ListTaskMain";
import MainAIAdvice from "./pages/ai_advice/MainAIAdvice";

const Main = () => {
  MainTaskHub();
  MainAIAdvice();
  MainDashboard();
  MainTimer();
  ListTaskMain();
};

export default Main;
