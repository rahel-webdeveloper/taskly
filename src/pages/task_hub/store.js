import { atom } from "nanostores";
import { controlTasksAllOperation } from "../../tasks/ListTasksLogic";
import { listTasks } from "../../tasks/store";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../data/ui-data";
import { liveTrackTasks, nullValidation, useFlatepickr } from "./TaskHubLogic";

export const isTasksPageOpen = atom(false);
export const check_Time_AllDay = atom(false);
export const isScrolledToLeft = atom(false);

export const taskTitle = atom("");
export const taskDescription = atom("");
export const category = atom("");
export const priority = atom({
  level: 0,
  label: "",
  color: "",
  icon: "",
});
export const startDateTime = atom(0);
export const dueDateTime = atom(0);

export const durationMinutes = atom(0);

export const notifiedTasks = new Set();

export const checkTimeAllDay = () => {
  const toggle_El_Time_AllDay = document.getElementById("checkbox");

  toggle_El_Time_AllDay.addEventListener("click", function () {
    document.getElementById("due_date-time").value = "";
    document.getElementById("start_date-time").value = "";

    check_Time_AllDay.set(this.checked);
    useFlatepickr();
  });
};

// Set priority related data
export const setPriorityData = (inputPriority) => {
  priority.set({
    level: parseInt(inputPriority),
    label: priorityLabels[inputPriority],
    color: priorityColors[inputPriority],
    icon: priorityIcons[inputPriority],
  });
};

// Set time difference in minutes from start and due date & time
export const calculateTimeDifference = (startTime, dueTime) => {
  const res = Math.abs(dueTime - startTime);
  return res / 1000 / 60;
};

export function addTaskData() {
  const updatedAt = new Date();

  durationMinutes.set(
    calculateTimeDifference(
      new Date(startDateTime.get()).getTime(),
      new Date(dueDateTime.get()).getTime()
    )
  );

  // Structure of task data
  listTasks.set([
    {
      id: String(listTasks.get().length + 1),
      description: taskDescription.get(),
      category: category.get(),
      startDateTime: startDateTime.get(),
      dueDateTime: dueDateTime.get(),
      durationMinutes: durationMinutes.get(),
      priority: {
        level: priority.get().level,
        label: priority.get().label,
        color: priority.get().color,
        icon: priority.get().icon,
      },
      state: "on-hold",
      isCompleted: false,
      updatedAt: updatedAt.toISOString(),
    },
    ...listTasks.get(),
  ]);

  controlTasksAllOperation();
  liveTrackTasks();
}
