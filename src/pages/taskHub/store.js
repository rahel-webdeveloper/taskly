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
  content: `You are a DESCRIPTION GENERATOR.
INPUT: a task title.
OUTPUT: a single-line plain-text task description suitable for an input element value.

Rules:
1) Output only the description text. No greetings, labels, explanations, or extra words.
2) Return one trimmed line only (no surrounding quotes, no leading/trailing whitespace).
3) Match the user's language (detect language from the title) and respond in that language.
4) Use sentence case (capitalize the first word; avoid ALL CAPS).
5) No emojis, no code/HTML/markdown, no bullet points.
6) If the title is empty or missing, respond exactly: Please enter a task title!
7) If the title is a list or long, synthesize a single clear summary description.

Examples:
Title: "Write blog post about PWA" -> Draft a concise blog post about Progressive Web Apps and their benefits.
Title (Pashto): "د پروژې پلان جوړول" -> د پروژې لپاره یو واضح او عملي پلان جوړ کړئ.

Strict: always follow these rules exactly.`,
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
        content: `Generate description base on this title (${title}), characters length must be between 70 and 350!`,
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
