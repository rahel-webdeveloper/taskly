import { atom } from "nanostores";
import { loadLocalStorage, saveLocalStorage } from "../data/localStorage.js";
import tasks from "../data/tasks.js";
import {
  addStyleToFilterControls,
  updateViewOnTask,
} from "./ListTasksLogic.js";
import { addTaskToList, updateTaskCount } from "./ListTasksRender.js";
import { addToDetailsCard } from "../pages/task_hub/TaskHubRender.js";

export const Id = atom(0);

export const listTasks = atom(loadLocalStorage("listTask") || tasks);
export const todayTasks = atom([]);
export const liveTasks = atom([]);

export const filterState = atom("all");
export const visibleTasks = atom([]);

export const taskToAssistant = atom(
  loadLocalStorage("task-to-assistant") || []
);

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
    const taskDate = new Date(task.updatedAt).toISOString().split("T")[0];

    return todayDate === taskDate && task;
  });

  todayTasks.set(filterTodayTasks);
};

// completing a task

export const completingTask = () => {
  listTasks.set(
    listTasks
      .get()
      .map((task) =>
        String(task.id) === Id.get()
          ? task.state === "in-progress"
            ? { ...task, state: "done" }
            : task.state === "done"
            ? { ...task, state: "on-hold" }
            : { ...task, state: "in-progress" }
          : task
      )
  );
  updateViewOnTask();
};

// deleting a task
export const deletingTask = () => {
  listTasks.set(listTasks.get().filter((task) => task.id !== Id.get()));
  updateViewOnTask();
};

// deleting all done tasks
export const deletingCompleteTasks = () => {
  listTasks.set(listTasks.get().filter((task) => task.state !== "done"));
  updateViewOnTask();
};

export const setTaskToAssitant = (Id) => {
  const selectedTask = listTasks.get().filter((task) => task.id === Id);

  taskToAssistant.set(selectedTask);

  saveLocalStorage(taskToAssistant.get(), "task-to-assistant");
};

// editing a task
export const editingTask = (editBox, editInput) => {
  const findTask = listTasks.get().find((task) => task.id === Id.get());

  editBox.style.display = "flex";
  editInput.value = findTask.description;
};

// Save edited task
export const saveEditedTask = (editInput, editBox) => {
  const updatedAt = new Date();

  if (editInput.value.length < 7 || editInput.length > 70) return;

  listTasks.set(
    listTasks.get().map((task) =>
      task.id === Id.get()
        ? {
            ...task,
            description: editInput.value,
            // updatedAt: updatedAt.toISOString(),
          }
        : task
    )
  );
  editBox.style.display = "none";

  addToDetailsCard(liveTasks.get());
  updateViewOnTask();
};

// Implement filter base on state
export const implementFilter = (tasks, state) => {
  filterState.set(state);
  visibleTasks.set(getFilterTasks(tasks, state));

  updateTaskCount(tasks, visibleTasks.get().length);
  addTaskToList(visibleTasks.get());
  addStyleToFilterControls();
};

const getFilterTasks = (tasks, state) => {
  return state === "all"
    ? tasks
    : tasks.filter((task) => task.state === state.toLowerCase());
};
