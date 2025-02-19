import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import { loadTasksFromStorage } from "./pages/tasks/TaskLogic";
import Timer from "./pages/timer/Timer";
import { atom } from "nanostores";
import { injectSpeedInsights } from "@vercel/speed-insights";

export const listTask = atom(loadTasksFromStorage() || []);

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
  injectSpeedInsights();
};

export default App;
