import flatpickr from "flatpickr";
import "notyf/notyf.min.css";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../data/ui-data.js";
import openNotification from "../../services/toastNotifications.js";
import { liveTasks } from "../../tasks/store.js";

import loadingDivComp from "../../components/Loading.js";
import sendFeedbackMain from "../../services/send_feedback-logic.js";
import {
  AddNewTask,
  cacheTaskHubEls,
  checkTimeAllDay,
  checkTime_AllDay_Switch,
  dueDateTime,
  generateDescription,
  isScrolledToLeft,
  notifiedTasksId,
  priorityLevel,
  startDateTime,
  taskCategory,
  taskDescription,
  taskTitle,
} from "./store.js";
import { addToDetailsCard } from "./TaskHubRender.js";

export default function taskHubLogic() {
  checkTime_AllDay_Switch();
  useFlatpickr();
  submitForm();
  initPrioritySlider();
  sendFeedbackMain();
}

// cacheTaskHubEls.set(getTaskHubElements());

export function getTaskHubElements() {
  const addTaskFormDialog = document.getElementById("add_task_form-dialog");
  const title = document.getElementById("task-title");
  const category = document.getElementById("category");
  const description = document.getElementById("task-description");
  const descriLoadDiv = document.getElementById("generating-des_loading-div");
  const taskPriorityEl = document.querySelector(".task_priority span");
  const priorityIcon = document.querySelector(".task_priority i");
  const prioritySliderEl = document.getElementById("priority_slider");

  const cardsContainer = document.querySelector("#details_cards");
  const scrollToEndIcon = document.querySelector("#scroll-end-icon i");
  const titleErrEl = document.getElementById("title-error");
  const cateErrEl = document.getElementById("category-error");
  const desErrEl = document.getElementById("description-error");
  const timeErrEl = document.getElementById("time-error");
  const form = document.getElementById("form");

  const doneTasksPercentageEl = document.getElementById("done-tasks");
  const tasksTrackedTimeEl = document.getElementById("tasks-time");
  const lengthTasksEl = document.getElementById("lenght-tasks");

  const startLabels = document.querySelectorAll(".time-label");
  const showTimeElements = document.querySelectorAll(".show-time-dev");
  const remainingTimeElements = document.querySelectorAll(".duration");
  const durationSecondsEl = document.querySelectorAll(".duration_seconds");

  const toggleAllDayEl = document.getElementById("checkbox");
  const dueTimeInput = document.getElementById("due_date-time");
  const startTimeInput = document.getElementById("start_date-time");

  return {
    addTaskFormDialog,
    title,
    category,
    description,
    descriLoadDiv,
    taskPriorityEl,
    priorityIcon,
    prioritySliderEl,
    cardsContainer,
    scrollToEndIcon,
    form,
    titleErrEl,
    cateErrEl,
    desErrEl,
    timeErrEl,
    doneTasksPercentageEl,
    tasksTrackedTimeEl,
    lengthTasksEl,
    startLabels,
    showTimeElements,
    remainingTimeElements,
    durationSecondsEl,
    toggleAllDayEl,
    dueTimeInput,
    startTimeInput,
  };
}

// --------**          Task Hub Dynamic UI Logic                 **--------//

//  +______+ Task Hub Events
export const taskHub_EventsHandler = (event) => {
  const target = event.target;

  if (target.closest("#des_generator_icon")) renderDescription();

  if (target.closest("#add-task-icon i")) setAddTaskDialogVisible(true);

  if (target.closest("#close_form-dialog")) setAddTaskDialogVisible(false);

  if (target.closest("#scroll-end-icon")) scrollToEndCard();

  if (target.closest("#create_btn") && !validateFormData())
    openNotification("warning", "Please fill all fields correctly!");
};

//  +______+ Task Form Container Display base on screen

const setAddTaskDialogVisible = (showModal) => {
  const { addTaskFormDialog } = cacheTaskHubEls.get();

  console.log(cacheTaskHubEls.get());

  showModal
    ? (addTaskFormDialog.style.display = "block")
    : (addTaskFormDialog.style.display = "none");
};

//  +______+ Generate AI Description

const renderDescription = async () => {
  const {
    description: descriTextArea,
    descriLoadDiv,
    title,
  } = cacheTaskHubEls.get();

  descriTextArea.value = "";
  descriTextArea.attributes.placeholder.value = "";
  descriLoadDiv.innerHTML = loadingDivComp();

  try {
    const res = await generateDescription(title.value);

    descriLoadDiv.innerHTML = "";
    for await (const part of res)
      descriTextArea.value += part?.text?.replaceAll(`\n`, `<br>`);
    //
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

//  +______+ Priority slider controller

const updatePriorityUI = () => {
  const { priorityIcon, taskPriorityEl, prioritySliderEl } =
    cacheTaskHubEls.get();

  const prioritySliderNumber = Number(prioritySliderEl.value) - 1;
  taskPriorityEl.textContent = priorityLabels[prioritySliderNumber];

  priorityIcon.className = "";
  priorityIcon.classList.add(priorityIcons[prioritySliderNumber]);

  priorityIcon.style.color = `${priorityColors[prioritySliderNumber]}`;

  priorityLevel.set(prioritySliderNumber + 1);
};

const initPrioritySlider = () => {
  const { prioritySliderEl } = cacheTaskHubEls.get();
  if (!prioritySliderEl) return;
  // initial update
  updatePriorityUI();
  // attach listener once
  prioritySliderEl.addEventListener("change", updatePriorityUI);
};

//  +______+ Scroll to end of cards
const scrollToEndCard = () => {
  const { scrollToEndIcon, cardsContainer } = cacheTaskHubEls.get();
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

function submitForm() {
  const { form } = cacheTaskHubEls.get();
  // **-------     alidate form data with evenry change change
  form.addEventListener("change", () => validateFormData());
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateFormData()) {
      AddNewTask();
      form.reset();

      initPrioritySlider();
    }
  });
}

export const useFlatpickr = () => {
  let startDateTimeConfig = {
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

  const startTimePicker = flatpickr("#start_date-time", startDateTimeConfig);
  const dueTimePicker = flatpickr("#due_date-time", dueDateTimeConfig);

  if (checkTimeAllDay.get()) {
    startTimePicker.destroy();
    dueTimePicker.destroy();

    startDateTimeConfig = {
      ...startDateTimeConfig,

      noCalendar: false,
      dateFormat: "Y-m-d h:i K",
    };

    dueDateTimeConfig = {
      ...dueDateTimeConfig,

      noCalendar: false,
      dateFormat: "Y-m-d h:i K",
    };

    flatpickr("#start_date-time", startDateTimeConfig);
    flatpickr("#due_date-time", dueDateTimeConfig);
  }
};

//  +______+ Validation of data

const validateFormData = () => {
  const { titleErrEl, cateErrEl, desErrEl, title, description, category } =
    cacheTaskHubEls.get();

  const titleValue = title.value;
  const descriptionValue = description.value;
  const categoryValue = category.value;

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
  const { timeErrEl } = cacheTaskHubEls.get();

  const startDateTimeValue = document.getElementById("start_date-time").value;
  const dueDateTimeValue = document.getElementById("due_date-time").value;

  const startDateTime = new Date(
    checkTimeAllDay.get()
      ? startDateTimeValue
      : getTimeAsDate(startDateTimeValue)
  ).getTime();

  const dueDateTime = new Date(
    checkTimeAllDay.get() ? dueDateTimeValue : getTimeAsDate(dueDateTimeValue)
  ).getTime();

  const nowTimestamp = new Date().getTime();

  if (!startDateTimeValue || !dueDateTimeValue) {
    timeErrEl.style.opacity = 1;

    timeErrEl.textContent = "Please enter valid time!";

    return false;
  } else if (startDateTime < nowTimestamp || dueDateTimeValue < nowTimestamp) {
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

export const todayReport = (todayTasks = []) => {
  const doneTasksPercentageEl = document.getElementById("done-tasks");
  const tasksTrackedTimeEl = document.getElementById("tasks-time");
  const lengthTasksEl = document.getElementById("lenght-tasks");

  // If none of the UI elements exist, nothing to update.
  if (!doneTasksPercentageEl && !tasksTrackedTimeEl && !lengthTasksEl) return;

  const tasks = Array.isArray(todayTasks) ? todayTasks : [];
  const totalTasks = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const totalTrackedMinutes = tasks.reduce(
    (acc, cur) => acc + (Number(cur?.duration) || 0),
    0
  );

  // Update done percentage
  if (doneTasksPercentageEl) {
    const percent =
      totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);
    doneTasksPercentageEl.textContent = `${percent}%`;
  }

  // Update total number of tasks
  if (lengthTasksEl) lengthTasksEl.textContent = String(totalTasks);

  // Helper: format minutes -> "Xh & Ym"
  const formatTrackedTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs}h & ${mins}m`;
  };

  if (tasksTrackedTimeEl)
    tasksTrackedTimeEl.textContent =
      totalTasks === 0 ? "0h & 0m" : formatTrackedTime(totalTrackedMinutes);
};

// --------**          Card logic                 **--------//

export function formatCardDate(task) {
  const { nowTimestamp, startTimestamp } = getTimeStamps(task);

  let showDate, isToday, isTomorrow;

  // If task has not started yet, show start time
  if (nowTimestamp < startTimestamp) {
    showDate = new Date(task.startTime);
    isToday = isDateToday(showDate);
    isTomorrow = isDateTomorrow(showDate);
  } else {
    // If task has started, show due time
    showDate = new Date(task.dueTime);
    isToday = isDateToday(showDate);
    isTomorrow = isDateTomorrow(showDate);
  }

  if (isToday || isTomorrow) {
    return showDate.toLocaleString("default", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
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

export function isDateTomorrow(date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate() + 1
  );
}

export function getRelativeDayLabel(task) {
  const { nowTimestamp, startTimestamp } = getTimeStamps(task);

  let showDate;

  nowTimestamp < startTimestamp
    ? (showDate = new Date(task.startTime))
    : (showDate = new Date(task.dueTime));

  return isDateToday(showDate)
    ? "Today "
    : isDateTomorrow(showDate)
    ? "Tomorrow "
    : "";
}

export const getTimeStamps = (task) => {
  const nowTimestamp = new Date().getTime();

  const startTimestamp = new Date(task.startTime).getTime();
  const dueTimestamp = new Date(task.dueTime).getTime();

  return { nowTimestamp, startTimestamp, dueTimestamp };
};

export function formatDuration(duration) {
  const days =
    Math.floor(duration / 60 / 24) > 1
      ? Math.floor(duration / 60 / 24) + "days"
      : Math.floor(duration / 60 / 24) + "day";

  const hours = (Math.floor((duration / 60) % 24) || 0) + "h";

  const minutes =
    Math.floor(duration % 60)
      .toString()
      .padStart(2, "0") + "m";

  const seconds =
    Math.floor((duration * 60) % 60)
      .toString()
      .padStart(2, "0") + "s";

  return { days, hours, minutes, seconds };
}

// Determine whether a task is currently active (started but not yet due).
// Also send a one-time notification when the task first becomes active.
const isTaskActive = (task) => {
  const { nowTimestamp, startTimestamp, dueTimestamp } = getTimeStamps(task);

  // Active when now is within [start, due)
  const started = nowTimestamp >= startTimestamp && nowTimestamp < dueTimestamp;

  if (started && !notifiedTasksId.has(task.id)) {
    openNotification("info", `Your task "${task.title}" has started!`);
    notifiedTasksId.add(task.id);
  }

  return !!started;
};

export const liveTrackTasks = () => {
  const durationInterval = setInterval(() => {
    const tasks = liveTasks.get();

    // Stop the interval if there are no live tasks
    if (!tasks || tasks.length === 0) {
      clearInterval(durationInterval);
      return;
    }

    tasks.forEach((task, idx) => {
      const { nowTimestamp, dueTimestamp } = getTimeStamps(task);

      if (isTaskActive(task)) {
        const remainingTime = dueTimestamp - nowTimestamp;
        cardTimerUI(task, idx, remainingTime);
      }
    });
  }, 1000);

  document.startViewTransition
    ? document.startViewTransition(() => addToDetailsCard(liveTasks.get()))
    : addToDetailsCard(liveTasks.get());
};

const cardTimerUI = (task, index, remainingTime) => {
  const startLabels = document.querySelectorAll(".time-label");
  const showTimeElements = document.querySelectorAll(".show-time-dev");
  const remainingTimeElements = document.querySelectorAll(".duration");
  const durationSecondsEl = document.querySelectorAll(".duration_seconds");

  const remainingMinutes = remainingTime / 1000 / 60;
  const { days, hours, minutes, seconds } = formatDuration(remainingMinutes);

  if (showTimeElements[index])
    showTimeElements[index].textContent = `
  ${getRelativeDayLabel(task)} ${formatCardDate(task)}`;

  if (startLabels[index]) startLabels[index].textContent = "End";

  if (durationSecondsEl[index]) durationSecondsEl[index].textContent = seconds;

  if (remainingTimeElements[index]) {
    remainingTimeElements[index].innerHTML = `${days} ${hours} ${minutes}`;
  }
};
