import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import {
  loadTasksFromStorage,
  updateViewOnTask,
} from "./pages/tasks/TaskLogic";
import Timer from "./pages/timer/Timer";
import { atom } from "nanostores";
import tasks from "./data/tasks";

export const listTask = atom(tasks);
if (!loadTasksFromStorage()) listTask.set(tasks);
updateViewOnTask();

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
};

export default App;
