import { atom } from "nanostores";
import { loadLocalStorage, saveLocalStorage } from "../data/localStorage.js";
import tasks from "../data/tasks.js";
import {
  addStyleToFilterControls,
  addStyleToSortControls,
  controlTasksAllOperation,
} from "./ListTasksLogic.js";
import { addTaskToList, updateTaskCount } from "./ListTasksRender.js";
import { addToDetailsCard } from "../pages/task_hub/TaskHubRender.js";
import { isDashboardOpen } from "../routes.js";

export const listTasks = atom(loadLocalStorage("listTask") || tasks);
export const liveTasks = atom([]);
export const todayTasks = atom([]);
export const filterState = atom("all");
export const visibleTasks = atom([]);
export const taskToAssistant = atom(
  loadLocalStorage("task-to-assistant") || []
);
export const selectedTaskId = atom(null);

const STATE = { IN_PROGRESS: "in-progress", DONE: "done", ON_HOLD: "on-hold" };

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
  setTodayTasks(listTasks.get());
};

// set today task
export const setTodayTasks = (tasks) => {
  const filterTodayTasks = tasks.filter((task) => {
    const todayDate = new Date().toISOString().split("T")[0];
    const taskDate = new Date(task.createdAt);

    if (!isNaN(taskDate)) {
      taskDate.toISOString().split("T")[0];

      return todayDate === taskDate && task;
    } else {
      console.log("today date", todayDate, "task Create date", taskDate);
    }
  });

  todayTasks.set(filterTodayTasks);
};

// completing a task
export const completingTask = () => {
  listTasks.set(
    listTasks
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
  listTasks.set(
    listTasks.get().filter((task) => task.id !== selectedTaskId.get())
  );
  controlTasksAllOperation();

  if (document.startViewTransition)
    document.startViewTransition(() => addToDetailsCard(liveTasks.get()));
  else addToDetailsCard(liveTasks.get());
};

// deleting all done tasks
export const deletingCompleteTasks = () => {
  listTasks.set(listTasks.get().filter((task) => task.state !== STATE.DONE));
  controlTasksAllOperation();
};

export const setTaskToAssitant = (Id) => {
  const selectedTask = listTasks.get().filter((task) => task.id === Id);

  taskToAssistant.set(selectedTask);
  saveLocalStorage(taskToAssistant.get(), "task-to-assistant");
};

// editing a task
export const editingTask = (editBox, editInput) => {
  const findTask = listTasks
    .get()
    .find((task) => task.id === selectedTaskId.get());

  editBox.style.display = "flex";
  editInput.value = findTask.description;
};

// Save edited task
export const saveEditedTask = (editInput, editBox) => {
  const createdAt = new Date();

  if (editInput.value.length < 7 || editInput.length > 70) return;

  listTasks.set(
    listTasks.get().map((task) =>
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

  addToDetailsCard(liveTasks.get());
  controlTasksAllOperation();
};

// Implement filter base on state
export const implementFilter = (tasks, state) => {
  filterState.set(state);
  visibleTasks.set(getFilterTasks(tasks, state));

  updateTaskCount(tasks, visibleTasks.get().length);
  if (document.startViewTransition)
    document.startViewTransition(() => {
      addTaskToList(visibleTasks.get());
      addStyleToFilterControls();
      addToDetailsCard(liveTasks.get());
    });
  else {
    addTaskToList(visibleTasks.get());
    addStyleToFilterControls();
    addToDetailsCard(liveTasks.get());
  }
};

const getFilterTasks = (tasks, state) => {
  return state === "all"
    ? tasks
    : tasks.filter((task) => task.state === state.toLowerCase());
};

export const implementSort = (tasks, state) => {
  setLiveTasks(getSortTasks(tasks, state));

  implementFilter(
    !isDashboardOpen.get() ? liveTasks.get() : listTasks.get(),
    filterState.get()
  );

  updateTaskCount(tasks, visibleTasks.get().length);
  addStyleToSortControls();
};

export const getSortTasks = (tasks, state = "date") => {
  // Name comparator
  const sortByName = (a, b) => a.description.localeCompare(b.description);

  // Date comparator
  const sortByDate = (a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  return state === "name"
    ? tasks.sort(sortByName)
    : tasks.sort(sortByDate).reverse();
};
