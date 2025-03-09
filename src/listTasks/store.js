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

export const listTask = atom(loadTasksFromStorage() || tasks);
export const stateName = atom("all");
export const visibleTasks = atom([]);

export const startTime = atom(0);
export const endTime = atom(0);

export const durationMinutes = atom(0);

export const startAmPm = atom("AM");
export const endAmPm = atom("PM");

// completing a task

export const completingTask = () => {
  listTask.set(
    listTask
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
  listTask.set(listTask.get().filter((task) => task.id !== Id.get()));
  updateViewOnTask();
};

// deleting all done tasks
export const deletingCompleteTasks = () => {
  listTask.set(listTask.get().filter((task) => task.state !== "done"));
  updateViewOnTask();
};

// editing a task
export const editingTask = (editBox, editInput) => {
  const findTask = listTask.get().find((task) => task.id === Id.get());

  editBox.style.display = "flex";
  editInput.value = findTask.description;
};

// Save edited task
export const saveEditedTask = (editInput, editBox) => {
  const updatedAt = new Date();

  if (editInput.value.length < 7 || editInput.length > 70) return;

  listTask.set(
    listTask.get().map((task) =>
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

export const onSelectedState = (listTasks, state) => {
  stateName.set(state);
  visibleTasks.set(getFilterTasks(listTasks, state));

  updateTaskCount(listTasks, visibleTasks.get().length);
  addTaskToList(visibleTasks.get());
};

const getFilterTasks = (listTask, state) => {
  return state === "all"
    ? listTask
    : listTask.filter((task) => task.state === state.toLowerCase());
};
