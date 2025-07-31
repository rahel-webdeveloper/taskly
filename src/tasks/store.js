import { atom } from "nanostores";
import { loadLocalStorage, saveLocalStorage } from "../data/localStorage.js";
import DashboardLogic, {
  initStatusChart,
  initTrackedTimeBars,
} from "../pages/dashboard/DashboardLogic.js";
import { liveTrackTasks } from "../pages/taskHub/TaskHubLogic.js";
import APIClient from "../services/api-client.js";
import {
  addStyleToFilterControls,
  addStyleToSortControls,
  controlTasksAllOperation,
} from "./tasksLogic.js";
import { renderTasks, updateTaskCount } from "./tasksRender.js";
import { isDashboardOpen } from "../routes.js";
// import { userId } from "../services/auth.service.js";

export const tasks = atom([]);
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

const apiClientTasks = new APIClient("tasks");

apiClientTasks
  .getTasks(localStorage.getItem("userId"))
  .then((res) => {
    tasks.set(res.tasks);

    controlTasksAllOperation();
    liveTrackTasks();
    if (isDashboardOpen.get()) DashboardLogic(true);
  })
  .catch((err) => console.log(err));

function getNextState(current) {
  if (current === STATE.DONE) return STATE.ON_HOLD;
  if (current === STATE.IN_PROGRESS) return STATE.DONE;
  return STATE.IN_PROGRESS;
}

// Set live tasks
export const setLiveTasks = (tasks) => {
  const now = new Date().getTime();

  const filterLiveTasks = tasks.filter((task) => new Date(task.dueTime) > now);

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
          ? { ...task, status: getNextState(task.status) }
          : task
      )
  );
  controlTasksAllOperation();
  initStatusChart(tasks.get(), true);
  initTrackedTimeBars(tasks.get(), true);
};

// deleting a task
export const deletingTask = () => {
  tasks.set(tasks.get().filter((task) => task.id !== selectedTaskId.get()));
  controlTasksAllOperation();
  initStatusChart(tasks.get(), true);
  initTrackedTimeBars(tasks.get(), true);
};

// deleting all done tasks
export const deletingCompleteTasks = () => {
  tasks.set(tasks.get().filter((task) => task.status !== STATE.DONE));
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

// Implement filter base on status
export const implementFilter = (tasks, status) => {
  filterState.set(status);
  visibleTasks.set(getFilterTasks(tasks, status));

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

const getFilterTasks = (tasks, status) => {
  return status === "all"
    ? tasks
    : tasks.filter((task) => task.status === status.toLowerCase());
};

export const implementSort = (tasks, status) => {
  sortState.set(status);
  const sortedTasks = getSortTasks(tasks, status);

  implementFilter(sortedTasks, filterState.get());
  addStyleToSortControls();
  liveTrackTasks();
};

export const getSortTasks = (tasks, status) => {
  // Name comparator
  const sortByName = (a, b) => a.description.localeCompare(b.description);

  // Date comparator
  const sortByDate = (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return status === "name"
    ? tasks.sort(sortByName)
    : tasks.sort(sortByDate).reverse();
};
