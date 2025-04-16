import { atom } from "nanostores";
import { loadLocalStorage } from "../data/localStorage.js";
import tasksData from "../data/tasksData.js";
import { updateViewOnTask } from "./ListTasksLogic.js";
import { addTaskToList, updateTaskCount } from "./ListTasksRender.js";
import { addToDetailsCard } from "../pages/tasks/TaskRender.js";

export const Id = atom(0);

export const listTasks = atom(loadLocalStorage("listTask") || tasksData);
export const todayTasks = atom([]);
export const liveTasks = atom([]);

export const tasksState = atom("all");
export const visibleTasks = atom([]);

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
            updatedAt: updatedAt.toISOString(),
          }
        : task
    )
  );
  editBox.style.display = "none";

  addToDetailsCard(liveTasks.get());
  updateViewOnTask();
};

// Get state for filter

export const onSelectedState = (tasks, state) => {
  tasksState.set(state);
  visibleTasks.set(getFilterTasks(tasks, state));

  updateTaskCount(tasks, visibleTasks.get().length);
  addTaskToList(visibleTasks.get());
};

const getFilterTasks = (tasks, state) => {
  return state === "all"
    ? tasks
    : tasks.filter((task) => task.state === state.toLowerCase());
};
