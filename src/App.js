import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import MainTimer from "./pages/timer/Timer";
import ListTaskMain from "./listTasks/ListTaskMain";
import MainAIAdvice from "./pages/ai_advice/MainAIAdvice";

const App = () => {
  MainTasks();
  MainAIAdvice();
  MainDashboard();
  MainTimer();
  ListTaskMain();
};

export default App;
