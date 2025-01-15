import Timer from "./components/timer/Timer";
import ConstTasks from "./components/constTasks/ConstTasks";
import Router from "./routes/routes";

const App = () => {
  Timer();
  ConstTasks();
  Router.init();
};
App();
