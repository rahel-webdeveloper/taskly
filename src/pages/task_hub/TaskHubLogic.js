import flatpickr from "flatpickr";
import "notyf/notyf.min.css";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../data/ui-data.js";
import openNotification from "../../services/toastNotifications.js";
import { controlTasksAllOperation } from "../../tasks/ListTasksLogic.js";
import { listTasks, liveTasks } from "../../tasks/store.js";

import { isDashboardOpen } from "../../routes.js";
import { loadingDivComp } from "../ai_advice/AIAdviceRender.js";
import {
  AddNewTask,
  check_Time_AllDay,
  checkTime_AllDay_Switch,
  dueDateTime,
  isScrolledToLeft,
  notifiedTasks,
  setPriorityData,
  startDateTime,
  systemMessage,
  taskCategory,
  taskDescription,
  taskTitle,
} from "./store.js";
import { addToDetailsCard as addDetailsCard } from "./TaskHubRender.js";
import sendFeedbackMain from "../../services/send_feedback-logic.js";

export default async function TaskHubLogic() {
  const taskHubPage = document.getElementById("task__hub-page");

  if (taskHubPage) {
    checkTime_AllDay_Switch();
    useFlatepickr();
    SubmitForm();
    controlTasksAllOperation();
    liveTrackTasks();
    prioritySliderController();
    sendFeedbackMain();

    taskHubPage.addEventListener("click", taskHub_EventsHandler);
  }
}

// --------**          Task Hub Dynamic UI Logic                 **--------//

//  +______+ Task Hub Events
const taskHub_EventsHandler = (event) => {
  const target = event.target;

  if (target.closest("#des_generator_icon")) generateDescription();

  if (target.closest("#add-task-icon i")) addTaskFormDialog_Contro(true);

  if (target.closest("#close_form-dialog")) addTaskFormDialog_Contro(false);

  if (target.closest("#scroll-end-icon")) scrollToEndCard();

  if (target.closest("#create_btn") && !validateFormData())
    openNotification("warning", "Please fill out the form!");
};

//  +______+ Task Form Container Display base on screen

const addTaskFormDialog_Contro = (showModal) => {
  const addTaskFormDialog = document.getElementById("add_task_form-dialog");

  showModal
    ? (addTaskFormDialog.style.display = "block")
    : (addTaskFormDialog.style.display = "none");
};

//  +______+ Generate AI Description

const generateDescription = async () => {
  const titleValue = document.getElementById("task-title").value;
  const descriTextArea = document.getElementById("task-description");
  const descriLoadDiv = document.getElementById("descr_loading");

  descriTextArea.value = "";
  descriTextArea.attributes.placeholder.value = "";
  descriLoadDiv.innerHTML = loadingDivComp();

  try {
    const res = await renderDescription(titleValue);

    descriLoadDiv.innerHTML = "";
    // descriTextArea.value = response.message.content;

    for await (const part of res) {
      descriTextArea.value += part?.text?.replaceAll(`\n`, `<br>`);

      console.log(part?.text);
    }
  } catch (err) {
    descriLoadDiv.innerHTML = "";

    descriTextArea.value += `
        ${
          err.message === "puter is not defined"
            ? "Check your internet and try again!"
            : err.error.delegate == "usage-limited-chat"
            ? "Usage limit exceeded!"
            : " Something went wrong!"
        }
    `;
  }
};

const renderDescription = async (title) => {
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

//  +______+ Priority slider contoller

const prioritySliderController = () => {
  const taskPriorityEl = document.querySelector(".task_priority span");
  const priorityIcon = document.querySelector(".task_priority i");

  const prioritySliderEl = document.getElementById("priority_slider");
  const prioritySliderNumber = prioritySliderEl.value - 1;

  taskPriorityEl.textContent = priorityLabels[prioritySliderNumber];

  priorityIcon.className = "";
  priorityIcon.classList.add(priorityIcons[prioritySliderNumber]);
  priorityIcon.style.color = `${priorityColors[prioritySliderNumber]}`;

  setPriorityData(prioritySliderNumber);

  // Call every time the slider changes
  prioritySliderEl.addEventListener("change", prioritySliderController);
};

//  +______+ Scroll to end of cards
const scrollToEndCard = () => {
  const cardsContainer = document.querySelector("#details_cards");
  const scrollToEndIcon = document.querySelector("#scroll-end-icon i");
  const targetScrollClass = scrollToEndIcon.classList;

  if (!isScrolledToLeft.get()) {
    cardsContainer.scrollTo({
      left: cardsContainer.scrollWidth,
      behavior: "smooth",
    });

    targetScrollClass.add("bi-align-start");

    isScrolledToLeft.set(true);
  } else {
    cardsContainer.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    targetScrollClass.remove("bi-align-start");

    isScrolledToLeft.set(false);
  }
};

// --------**          Form Logic                 **--------//

function SubmitForm() {
  const form = document.getElementById("form");

  // **-------      Validate form data with Change event
  form.addEventListener("change", () => validateFormData());

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateFormData()) {
      AddNewTask();
      openNotification("success", "New task created successfully!");

      form.reset();

      prioritySliderController();
    }
  });
}

export const useFlatepickr = () => {
  let starteDateTimeConfig = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    enableSeconds: true,
    time_24hr: false,
    disableMobile: true,
    position: "auto center",

    onChange: function (selectedDates, dateStr) {
      const now = new Date(selectedDates).toISOString();
      startDateTime.set(now);
    },
  };

  let dueDateTimeConfig = {
    enableTime: true,
    noCalendar: true,
    enableSeconds: true,
    dateFormat: "h:i K",
    time_24hr: false,
    disableMobile: true,
    position: "auto center",

    onChange: function (selectedDates, dateStr) {
      const now = new Date(selectedDates).toISOString();
      dueDateTime.set(now);
    },
  };

  const startTimePicker = flatpickr("#start_date-time", starteDateTimeConfig);
  const dueTimePicker = flatpickr("#due_date-time", dueDateTimeConfig);

  if (check_Time_AllDay.get()) {
    startTimePicker.destroy();
    dueTimePicker.destroy();

    starteDateTimeConfig = {
      ...starteDateTimeConfig,

      noCalendar: false,
      dateFormat: "Y-m-d h:i K",
    };

    dueDateTimeConfig = {
      ...dueDateTimeConfig,

      noCalendar: false,
      dateFormat: "Y-m-d h:i K",
    };

    flatpickr("#start_date-time", starteDateTimeConfig);
    flatpickr("#due_date-time", dueDateTimeConfig);
  }
};

//  +______+ Validation of data

const validateFormData = () => {
  const titleErrEl = document.getElementById("title-error");
  const cateErrEl = document.getElementById("category-error");
  const desErrEl = document.getElementById("description-error");

  const titleValue = document.getElementById("task-title").value;
  const descriptionValue = document.getElementById("task-description").value;
  const categoryValue = document.getElementById("category").value;

  if (titleValue.length < 10) {
    titleErrEl.style.opacity = "1";
    titleErrEl.textContent = "The title must at least 10 characters";

    return false;
  } else if (titleValue.length > 60) {
    titleErrEl.style.opacity = "1";
    titleErrEl.textContent = "The description must be less than 60 characters.";

    return false;
  } else {
    taskTitle.set(titleValue);
    titleErrEl.style.opacity = "0";
  }

  if (categoryValue === "") {
    cateErrEl.textContent = "Please select at least one category!";
    cateErrEl.style.opacity = "1";

    return false;
  } else {
    taskCategory.set(categoryValue);
    cateErrEl.style.opacity = "0";
  }

  if (descriptionValue.length < 30) {
    desErrEl.style.opacity = "1";
    desErrEl.textContent = "The description must be at least 30 characters.";

    return false;
  } else if (descriptionValue.length > 350) {
    desErrEl.style.opacity = "1";
    desErrEl.textContent = "The description must be less than 350 characters.";

    return false;
  } else {
    taskDescription.set(descriptionValue.trim());
    desErrEl.style.opacity = "0";
  }

  if (timeValidation()) return true;
  else return false;
};

//  +______+ Get time as date for Time validation

const getTimeAsDate = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
};

const timeValidation = () => {
  const timeErrEl = document.getElementById("time-error");

  const startDateTimeValue = document.getElementById("start_date-time").value;
  const dueDateTimeValue = document.getElementById("due_date-time").value;

  const startDateTime = new Date(
    check_Time_AllDay.get()
      ? startDateTimeValue
      : getTimeAsDate(startDateTimeValue)
  ).getTime();

  const dueDateTime = new Date(
    check_Time_AllDay.get() ? dueDateTimeValue : getTimeAsDate(dueDateTimeValue)
  ).getTime();

  const now = new Date().getTime();

  if (!startDateTimeValue || !dueDateTimeValue) {
    timeErrEl.style.opacity = 1;

    timeErrEl.textContent = "Please enter valid time!";

    return false;
  } else if (startDateTime < now || dueDateTimeValue < now) {
    timeErrEl.style.opacity = "1";

    timeErrEl.textContent = "Start and due time should be greather than now!";

    return false;
  } else if (startDateTime > dueDateTime) {
    timeErrEl.style.opacity = "1";

    timeErrEl.textContent = "Due time must be greather than start time!";

    return false;
  } else if (startDateTime === dueDateTime) {
    timeErrEl.style.opacity = "1";

    timeErrEl.textContent = "The time should be not equal!";

    return false;
  } else {
    timeErrEl.style.opacity = "0";

    return true;
  }
};

// --------**          Today's Report                 **--------//

export const todayReport = (todayTasks) => {
  const doneTasksPercentageEl = document.getElementById("done-tasks");
  const tasksTrackedTimeEl = document.getElementById("tasks-time");
  const lengthTasksEl = document.getElementById("lenght-tasks");

  const todayDoneTasks = todayTasks.filter((task) => task.state === "done");
  const todayTrackedTime = todayTasks.reduce(
    (accumlator, currentValue) => accumlator + currentValue.durationMinutes,
    0
  );

  if (doneTasksPercentageEl)
    doneTasksPercentageEl.innerText =
      todayDoneTasks.length === 0
        ? "0%"
        : ((todayDoneTasks.length / todayTasks.length) * 100).toFixed(0) + "%";

  if (lengthTasksEl) lengthTasksEl.textContent = todayTasks.length;

  if (tasksTrackedTimeEl)
    tasksTrackedTimeEl.textContent =
      todayTasks.length === 0
        ? "0h & 0m"
        : `${Math.floor(todayTrackedTime / 60) + "h"} ${
            todayTrackedTime / 60 > 0 && todayTrackedTime ? "&" : ""
          } ${(todayTrackedTime % 60) + "m"}`;
};

// --------**          Card logic                 **--------//

export function formateCardDate(task) {
  const now = new Date().getTime();
  const startTimestamp = new Date(task.startDateTime).getTime();

  let showDate, isToday;

  // If task has not started yet, show start time
  if (now < startTimestamp) {
    showDate = new Date(task.startDateTime);
    isToday = isDateToday(showDate);
  } else {
    // If task has started, show due time
    showDate = new Date(task.dueDateTime);
    isToday = isDateToday(showDate);
  }

  if (isToday) {
    return showDate.toLocaleString("default", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return showDate.toLocaleString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
}

export function isDateToday(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function returnTodayString(task) {
  const now = new Date().getTime();
  const startTimestamp = new Date(task.startDateTime).getTime();

  let showDate;
  if (now < startTimestamp) {
    showDate = new Date(task.startDateTime);
  } else {
    showDate = new Date(task.dueDateTime);
  }

  return isDateToday(showDate) ? "Today " : "";
}

export const liveTrackTasks = () => {
  const durationInterval = setInterval(() => {
    listTasks.get().map((task, idx) => {
      const nowTimestamp = new Date().getTime();

      const startTimestamp = new Date(task.startDateTime).getTime();
      const dueTimestamp = new Date(task.dueDateTime).getTime();

      liveTasks.get().length === 0 && clearInterval(durationInterval);

      if (dueTimestamp > nowTimestamp) {
        // Give notification when the task is started
        if (
          Math.floor(nowTimestamp / 10000) >=
            Math.floor(startTimestamp / 10000) &&
          !notifiedTasks.has(task.id)
        ) {
          openNotification(
            "info",
            `Your (${task.description.slice(0, 12)}...) task is started!`
          );

          notifiedTasks.add(task.id);
        }
        if (nowTimestamp > startTimestamp) {
          const remainingTime = dueTimestamp - nowTimestamp;

          cardTimerUI(task, idx, remainingTime);
        }
      }
    });
  }, 1000);

  if (document.startViewTransition)
    document.startViewTransition(() =>
      addDetailsCard(!isDashboardOpen.get() ? liveTasks.get() : listTasks.get())
    );
  else
    addDetailsCard(!isDashboardOpen.get() ? liveTasks.get() : listTasks.get());
};

const cardTimerUI = (task, index, remainingTime) => {
  const startLabels = document.querySelectorAll(".time-label");
  const timeElements = document.querySelectorAll(".show-time-dev");
  const remainingTimeElements = document.querySelectorAll(".duration");
  const durationSecondsEl = document.querySelectorAll(".duration_seconds");

  const remainingSeconds = Math.floor(remainingTime / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (timeElements[index])
    timeElements[index].textContent = `
  ${returnTodayString(task)} ${formateCardDate(task)}`;

  if (startLabels[index]) startLabels[index].textContent = "End";

  if (durationSecondsEl[index])
    durationSecondsEl[index].textContent =
      (remainingSeconds % 60).toString().padStart(2, "0") + "s";

  if (remainingTimeElements[index]) {
    remainingTimeElements[index].innerHTML = ` ${
      remainingDays
        ? remainingDays > 1
          ? remainingDays + "days "
          : remainingDays + "day "
        : ""
    } 
    ${remainingHours ? (remainingHours % 24) + "h " : ""} 
    ${(remainingMinutes % 60).toString().padStart(2, "0") + "m "}   
  `;
  }
};
