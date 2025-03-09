import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import { loadTasksFromStorage } from "./listTasks/ListTasksLogic";
import Timer from "./pages/timer/Timer";
import { atom } from "nanostores";
import tasks from "./data/tasks";
import ListTaskMain from "./listTasks/ListTaskMain";

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
  ListTaskMain();
};

export default App;
