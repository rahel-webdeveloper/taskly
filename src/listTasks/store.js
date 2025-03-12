import { atom } from "nanostores";
import { updateViewOnTask } from "./ListTasksLogic.js";
import { updateTaskCount } from "./ListTasksRender.js";
import { addTaskToList } from "./ListTasksRender.js";
import { loadTasksFromStorage } from "./ListTasksLogic.js";
import tasks from "../data/tasks.js";

export const Id = atom(0);

export const taskDescription = atom("");
export const category = atom("");
export const priority = atom({
  level: 0,
  label: "",
  color: "",
  icon: "",
});

export const listTasks = atom(loadTasksFromStorage() || tasks);
export const todayTasks = atom([]);

export const tasksState = atom("all");
export const visibleTasks = atom([]);

export const startTime = atom(0);
export const endTime = atom(0);

export const durationMinutes = atom(0);

export const startAmPm = atom("AM");
export const endAmPm = atom("PM");

// get today task
export const setTodayTasks = (tasks) => {
  const todayTasksFilter = tasks.filter((task) => {
    const todayDate = new Date().toISOString().split("T")[0];
    const taskDate = new Date(task.updatedAt).toISOString().split("T")[0];

    return todayDate === taskDate && task;
  });

  todayTasks.set(todayTasksFilter);
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
