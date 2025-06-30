import { atom } from "nanostores";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../data/ui-data";
import { controlTasksAllOperation } from "../../tasks/ListTasksLogic";
import { listTasks } from "../../tasks/store";
import { liveTrackTasks, useFlatepickr } from "./TaskHubLogic";

export const systemMessage = {
  role: "system",
  content: `Hey, you are description generator base on given title do not write before and after sentences like this is your description and how can I help just write description no explaination bencause I will use It as Input element value.
    
  **-- if user has not entered title give him a message to enter thier task title!
    `,
};

export const isTasksPageOpen = atom(false);
export const check_Time_AllDay = atom(false);
export const isScrolledToLeft = atom(false);

export const taskTitle = atom("");
export const taskDescription = atom("");
export const taskCategory = atom("");
export const taskPriority = atom({
  level: 0,
  label: "",
  color: "",
  icon: "",
});
export const startDateTime = atom(0);
export const dueDateTime = atom(0);

export const durationMinutes = atom(0);

export const notifiedTasks = new Set();

export const checkTime_AllDay_Switch = () => {
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
  taskPriority.set({
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

export function AddNewTask() {
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
      title: taskTitle.get(),
      description: taskDescription.get(),
      category: taskCategory.get(),
      startDateTime: startDateTime.get(),
      dueDateTime: dueDateTime.get(),
      durationMinutes: durationMinutes.get(),
      priority: {
        level: taskPriority.get().level,
        label: taskPriority.get().label,
        color: taskPriority.get().color,
        icon: taskPriority.get().icon,
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
