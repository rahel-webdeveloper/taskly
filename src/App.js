import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import { loadTasksFromStorage } from "./pages/tasks/TaskLogic";
import Timer from "./pages/timer/Timer";
import { atom } from "nanostores";

export const listTask = atom(loadTasksFromStorage() || []);

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
};

export default App;
