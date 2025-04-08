import MainDashboard from "./pages/dashboard/MainDashboard";
import MainTasks from "./pages/tasks/MainTasks";
import MainTimer from "./pages/timer/Timer";
import ListTaskMain from "./listTasks/ListTaskMain";

const App = () => {
  MainTimer();
  MainTasks();
  MainDashboard();
  ListTaskMain();
};

export default App;
