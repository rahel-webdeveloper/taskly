import { atom } from "nanostores";
import { loadTasksFromStorage, updateViewOnTask } from "./TaskLogic";
import { updateTaskCount, addTaskToHtml } from "./TaskRender";
import { listTask } from "../../App.js";

export const Id = atom(0);

export const taskDescription = atom("");
export const category = atom("");
export const priority = atom({
  level: 0,
  label: "",
  color: "",
  icon: "",
});

export const stateName = atom("all");
export const visibleTasks = atom([]);

export const startTime = atom(0);
export const endTime = atom(0);

export const durationMinutes = atom(0);

export const startAmPm = atom("AM");
export const endAmPm = atom("PM");

const TaskEvents = (() => {
  // completing a task
  const completingTask = () => {
    listTask.set(
      listTask
        .get()
        .map((task) =>
          String(task.id) === Id.get()
            ? task.state === "in-progress"
              ? { ...task, state: "done" }
              : { ...task, state: "in-progress" }
            : task
        )
    );
    updateViewOnTask();
  };

  // deleting a task
  const deletingTask = () => {
    listTask.set(listTask.get().filter((task) => task.id !== Id.get()));
    updateViewOnTask();
  };

  // deleting all done tasks
  const deletingCompleteTasks = () => {
    listTask.set(listTask.get().filter((task) => task.state !== "done"));
    updateViewOnTask();
  };

  // editing a task
  const editingTask = (editBox, editInput) => {
    const findTask = listTask.get().find((task) => task.id === Id.get());

    editBox.style.display = "flex";
    editInput.value = findTask.description;
  };

  // Save edited task
  const saveEditedTask = (editInput, editBox) => {
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

  const onSelectedState = (listTasks, state) => {
    stateName.set(state);
    visibleTasks.set(getFilterTasks(listTasks, state));

    updateTaskCount(listTasks, visibleTasks.get().length);
    addTaskToHtml(visibleTasks.get());
  };

  const getFilterTasks = (listTask, state) => {
    return state === "all"
      ? listTask
      : listTask.filter((task) => task.state === state.toLowerCase());
  };

  return {
    completingTask,
    deletingTask,
    deletingCompleteTasks,
    editingTask,
    saveEditedTask,
    onSelectedState,
    getFilterTasks,
  };
})();

export default TaskEvents;
