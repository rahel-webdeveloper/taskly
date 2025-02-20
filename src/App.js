import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import { loadTasksFromStorage } from "./pages/tasks/TaskLogic";
import Timer from "./pages/timer/Timer";
import { atom } from "nanostores";
import tasks from "./data/tasks";

export const listTask = atom(loadTasksFromStorage() || []);
if (!loadTasksFromStorage()) listTask.set(tasks);

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
};

export default App;
