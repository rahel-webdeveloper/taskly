import { atom } from "nanostores";
import { loadTasksFromStorage, updateViewOnTask } from "./TaskLogic";
import { updateTaskCount, addTaskToHtml } from "./TaskRender";

export const Id = atom(0);
export const stateName = atom("all");
export const visibleTasks = atom([]);

export const startTime = atom(0);
export const endTime = atom(0);

export const startAmPm = atom("AM");
export const endAmPm = atom("PM");

export const listTask = atom(loadTasksFromStorage() || []);

const TaskEvents = (() => {
  // completing a task
  const completingTask = () => {
    listTask.set(
      listTask
        .get()
        .map((task) =>
          task.id === Id.get()
            ? task.state === "active"
              ? { ...task, state: "complete" }
              : { ...task, state: "active" }
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

  // deleting all complete tasks
  const deletingCompleteTasks = () => {
    listTask.set(listTask.get().filter((task) => task.state !== "complete"));
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
    if (editInput.value.length < 7 || editInput.length > 70) return;

    listTask.set(
      listTask
        .get()
        .map((task) =>
          task.id === Id.get()
            ? { ...task, description: editInput.value }
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

    updateTaskCount(listTasks.length, visibleTasks.get().length);
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
