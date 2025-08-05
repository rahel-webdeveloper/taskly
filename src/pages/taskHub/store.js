import { atom } from "nanostores";
import APIClient from "../../services/api-client";
import { userId } from "../../services/auth.service";
import { tasks } from "../../tasks/store";
import { controlTasksAllOperation } from "../../tasks/tasksLogic";
import { liveTrackTasks, taskHubEls, useFlatepickr } from "./TaskHubLogic";
import APIErrorController from "../../services/data.error.controller";
import openNotification from "../../services/toastNotifications";

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
export const prioritylevel = atom(3);
export const startDateTime = atom(0);
export const dueDateTime = atom(0);
export const duration = atom(0);
export const notifiedTasksId = new Set();

const apiClientTasks = new APIClient("tasks");

export const generateDescription = async (title) => {
  const reply = await puter.ai.chat(
    [
      systemMessage,
      {
        role: "user",
        content: `Generate description base on this title (${title}), characters length must between 30 and 350!`,
      },
    ],
    {
      // model: "gpt-4o",
      model: "grok-beta",
      stream: true,
    }
  );

  return reply;
};

export const checkTime_AllDay_Switch = () => {
  const { toggleAllDayEl, startTimeInput, dueTimeInput } = taskHubEls();

  toggleAllDayEl.addEventListener("click", function () {
    startTimeInput.value = "";
    dueTimeInput.value = "";

    check_Time_AllDay.set(this.checked);
    useFlatepickr();
  });
};

// Set time difference in minutes from start and due date & time
export const calculateTimeDifference = (startTime, dueTime) => {
  const res = Math.abs(dueTime - startTime);
  return res / 1000 / 60;
};

export function AddNewTask() {
  const createdAt = new Date().toISOString();

  duration.set(
    calculateTimeDifference(
      new Date(startDateTime.get()).getTime(),
      new Date(dueDateTime.get()).getTime()
    )
  );

  // Structure of task data
  tasks.set([
    {
      title: taskTitle.get(),
      description: taskDescription.get(),
      category: taskCategory.get(),
      startTime: startDateTime.get(),
      dueTime: dueDateTime.get(),
      duration: duration.get(),
      prioritylevel: prioritylevel.get(),
      status: "on-hold",
      createdAt: createdAt,
    },
    ...tasks.get(),
  ]);

  controlTasksAllOperation();
  liveTrackTasks();

  apiClientTasks
    .createTask(tasks.get()[0])
    .then((res) => {
      if (res.success)
        openNotification("success", "New task created successfully!");
    })
    .catch((err) => {
      tasks.get().shift();

      controlTasksAllOperation();
      liveTrackTasks();

      APIErrorController(err, "Your task not created please try again.");
    });
}
