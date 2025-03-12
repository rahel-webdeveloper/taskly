import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import Timer from "./pages/timer/Timer";
import ListTaskMain from "./listTasks/ListTaskMain";

const App = async () => {
  Timer();
  MainTasks();
  MainDashboard();
  ListTaskMain();
};

export default App;
