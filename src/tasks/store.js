import { atom } from "nanostores";
import { loadLocalStorage, saveLocalStorage } from "../data/localStorage.js";
import { liveTrackTasks } from "../pages/taskHub/TaskHubLogic.js";
import {
  addStyleToFilterControls,
  addStyleToSortControls,
  controlTasksAllOperation,
} from "./tasksLogic.js";
import { renderTasks, updateTaskCount } from "./tasksRender.js";
import { userId } from "../pages/auth/store.js";
import { useTasks } from "../hooks/useTasks.js";

export const tasks = atom(loadLocalStorage("listTask"));
export const liveTasks = atom([]);
export const todayTasks = atom([]);

export const filterState = atom("all");
export const sortState = atom("date");

export const visibleTasks = atom([]);
export const taskToAssistant = atom(
  loadLocalStorage("task-to-assistant") || []
);
export const selectedTaskId = atom(null);

const STATE = { IN_PROGRESS: "in-progress", DONE: "done", ON_HOLD: "on-hold" };

useTasks.getUserTasks(userId.get());

function getNextState(current) {
  if (current === STATE.DONE) return STATE.ON_HOLD;
  if (current === STATE.IN_PROGRESS) return STATE.DONE;
  return STATE.IN_PROGRESS;
}

// Set live tasks
export const setLiveTasks = (tasks) => {
  const now = new Date().getTime();

  const filterLiveTasks = tasks.filter(
    (task) => new Date(task.dueDateTime) > now
  );

  liveTasks.set(filterLiveTasks);
  setTodayTasks(tasks);
};

// set today task
export const setTodayTasks = (tasks) => {
  const todayDate = new Date().toISOString().split("T")[0];

  const filterTodayTasks = tasks.filter(
    (task) => todayDate === new Date(task.createdAt).toISOString().split("T")[0]
  );

  todayTasks.set(filterTodayTasks);
};

// completing a task
export const completingTask = () => {
  tasks.set(
    tasks
      .get()
      .map((task) =>
        String(task.id) === selectedTaskId.get()
          ? { ...task, state: getNextState(task.state) }
          : task
      )
  );
  controlTasksAllOperation();
};

// deleting a task
export const deletingTask = () => {
  tasks.set(tasks.get().filter((task) => task.id !== selectedTaskId.get()));
  controlTasksAllOperation();
};

// deleting all done tasks
export const deletingCompleteTasks = () => {
  tasks.set(tasks.get().filter((task) => task.state !== STATE.DONE));
  controlTasksAllOperation();
};

export const setTaskToAssitant = (Id) => {
  const selectedTask = tasks.get().filter((task) => task.id === Id);

  taskToAssistant.set(selectedTask);
  saveLocalStorage(taskToAssistant.get(), "task-to-assistant");
};

// editing a task
export const editingTask = (editBox, editInput) => {
  const findTask = tasks.get().find((task) => task.id === selectedTaskId.get());

  editBox.style.display = "flex";
  editInput.value = findTask.description;
};

// Save edited task
export const saveEditedTask = (editInput, editBox) => {
  const updatedAt = new Date();

  if (editInput.value.length < 7 || editInput.length > 250) return;

  tasks.set(
    tasks.get().map((task) =>
      task.id === selectedTaskId.get()
        ? {
            ...task,
            description: editInput.value,
            updatedAt: updatedAt.toISOString(),
          }
        : task
    )
  );
  editBox.style.display = "none";
  controlTasksAllOperation();
};

// Implement filter base on state
export const implementFilter = (tasks, state) => {
  filterState.set(state);
  visibleTasks.set(getFilterTasks(tasks, state));

  updateTaskCount(tasks, visibleTasks.get().length);

  if (document.startViewTransition)
    document.startViewTransition(() => {
      renderTasks(visibleTasks.get());
      addStyleToFilterControls();
    });
  else {
    renderTasks(visibleTasks.get());
    addStyleToFilterControls();
  }
};

const getFilterTasks = (tasks, state) => {
  return state === "all"
    ? tasks
    : tasks.filter((task) => task.state === state.toLowerCase());
};

export const implementSort = (tasks, state) => {
  sortState.set(state);
  const sortedTasks = getSortTasks(tasks, state);

  implementFilter(sortedTasks, filterState.get());
  addStyleToSortControls();
  liveTrackTasks();
};

export const getSortTasks = (tasks, state) => {
  // Name comparator
  const sortByName = (a, b) => a.description.localeCompare(b.description);

  // Date comparator
  const sortByDate = (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return state === "name"
    ? tasks.sort(sortByName)
    : tasks.sort(sortByDate).reverse();
};

// async function getA() {
//   try {
//     const res = await axios.get(
//       "https://taskly-backend-rtg8.onrender.com/api/v1/tasks" // use valid route
//     );
//     console.log(res.data);
//   } catch (e) {
//     console.log("Error:", e.message);
//   }
// }
// getA();
