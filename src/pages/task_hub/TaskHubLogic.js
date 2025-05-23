import flatpickr from "flatpickr";
import "notyf/notyf.min.css";
import { updateViewOnTask } from "../../tasks/ListTasksLogic.js";
import { listTasks, liveTasks } from "../../tasks/store.js";
import { isDashboardOpen } from "../dashboard/MainDashboard.js";
import {
  addTaskData,
  category,
  check_Time_AllDay,
  checkTimeAllDay,
  dueDateTime,
  isScrolledToLeft,
  priority,
  setPriorityData,
  startDateTime,
  taskDescription,
} from "./store.js";
import { addToDetailsCard } from "./TaskHubRender.js";
import openNotification from "../../services/toastNotifications.js";

export default async function TaskHubLogic() {
  const tasksHomePage = document.getElementById("tasks-home-page");

  if (tasksHomePage) {
    checkTimeAllDay();
    useFlatepickr();
    submitForm();
    updateViewOnTask();
    liveTrackTasks();

    tasksHomePage.addEventListener("click", addTaskToggleAndEvents);
  }
}

const addTaskToggleAndEvents = (event) => {
  const addTaskIcon = document.querySelector("#add-task-icon i");
  const formContainer = document.querySelector(".form-container");

  const target = event.target;

  if (target.closest("#add-task-icon i")) {
    const formStyle = formContainer.style.display;

    if (window.innerWidth < 1024) {
      formContainer.style.display = formStyle === "block" ? "none" : "block";

      addTaskIcon.classList.toggle("bi-x");
    } else {
      addTaskIcon.classList.remove("bi-x");

      formContainer.style.display = "block";
    }
  }
  if (target.closest("#scroll-end-icon")) scrollToEndCard();

  if (target.closest("#create_btn") && !validationOfFormData())
    openNotification("warning", "Please fill out the form!");
};

const styleForAddTask = () => {
  const addTaskIcon = document.querySelector("#add-task-icon i");
  const formContainer = document.querySelector(".form-container");
  if (addTaskIcon) {
    if (window.innerWidth >= 1024) {
      addTaskIcon.classList.remove("bi-x");
      formContainer.style.display = "block";
    } else {
      !addTaskIcon.classList.contains("bi-x")
        ? (formContainer.style.display = "none")
        : (formContainer.style.display = "block");
    }
  }
};

window.addEventListener("resize", styleForAddTask);

// Scroll to end of cards
const scrollToEndCard = () => {
  const cardsContainer = document.querySelector("#details_cards");
  const scrollToEndIcon = document.querySelector("#scroll-end-icon i");

  if (!isScrolledToLeft.get()) {
    cardsContainer.scrollTo({
      left: cardsContainer.scrollWidth,
      behavior: "smooth",
    });

    scrollToEndIcon.classList.add("bi-align-start");

    isScrolledToLeft.set(true);
  } else {
    cardsContainer.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    scrollToEndIcon.classList.remove("bi-align-start");

    isScrolledToLeft.set(false);
  }
};

function submitForm() {
  const form = document.getElementById("form");

  // Validation with change of input
  form.addEventListener("change", function () {
    setPriorityData();
    validationOfFormData();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validationOfFormData()) {
      addTaskData();
      openNotification("success", "New task created successfully!");

      // Reset from
      form.reset();
      priority.set({
        level: 0,
        label: "",
        color: "",
        icon: "",
      });
    }
  });
}

export const useFlatepickr = () => {
  let starteDateTimeConfig = {
    enableTime: true,
    noCalendar: true,
    // enableSeconds: true,
    dateFormat: "h:i K",
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
    // enableSeconds: true,
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

// Validation of data
const validationOfFormData = () => {
  const desErrEl = document.getElementById("description-error");
  const cateErrEl = document.getElementById("category-error");
  const prioErrEl = document.getElementById("priority-error-message");

  const tasDescriptionValue = document.getElementById("task-description").value;
  const categoryValue = document.getElementById("category").value;

  // description
  if (tasDescriptionValue.length < 7) {
    desErrEl.style.opacity = "1";

    return false;
  } else if (tasDescriptionValue.length >= 85) {
    desErrEl.style.opacity = "1";
    desErrEl.textContent = "The description must be less than 85 characters.";

    return false;
  } else {
    taskDescription.set(tasDescriptionValue.trim());
    desErrEl.style.opacity = "0";
  }

  if (
    nullValidation(categoryValue, cateErrEl) &&
    nullValidation(priority.get().level, prioErrEl) &&
    timeValidation()
  ) {
    category.set(categoryValue);

    return true;
  } else return false;
};

// Get time as date for validation
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

    timeErrEl.textContent =
      "Start datetime and due datetime should be greather than now!";

    return false;
  } else if (startDateTime > dueDateTime) {
    timeErrEl.style.opacity = "1";

    timeErrEl.textContent =
      "The due datetime must be greather than start date & time!";

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

export function nullValidation(elementValue, erroreEl) {
  if (!elementValue) {
    erroreEl.style.opacity = "1";

    return false;
  } else {
    erroreEl.style.opacity = "0";

    return true;
  }
}

// Card logic

const notifiedTasks = new Set();

export const liveTrackTasks = () => {
  const durationInterval = setInterval(() => {
    listTasks.get().map((task, index) => {
      const now = new Date().getTime();

      const startDateTime = new Date(task.startDateTime).getTime();
      const dueDateTime = new Date(task.dueDateTime).getTime();

      liveTasks.get().length === 0 && clearInterval(durationInterval);

      if (dueDateTime > now) {
        // add notification when the task is started
        if (
          Math.floor(now / 10000) >= Math.floor(startDateTime / 10000) &&
          !notifiedTasks.has(task.id)
        ) {
          openNotification(
            "info",
            `Your (${task.description.slice(0, 12)}...) task is started!`
          );

          notifiedTasks.add(task.id);
        }
        if (now > startDateTime) {
          const remainingTime = dueDateTime - now;

          timerCardUI(task, index, remainingTime);
        }
      }
    });
  }, 1000);

  addToDetailsCard(!isDashboardOpen.get() ? liveTasks.get() : listTasks.get());
};

const timerCardUI = (task, index, remainingTime) => {
  const startLabels = document.querySelectorAll(".start-label");
  const timeElements = document.querySelectorAll(".start-time");
  const remainingTimeElements = document.querySelectorAll(".duration");

  const remainingSeconds = Math.floor(remainingTime / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (timeElements[index])
    timeElements[index].textContent = ` ${
      new Date().toISOString().slice(0, 10) !==
      new Date(task.dueDateTime).toISOString().slice(0, 10)
        ? new Date(task.dueDateTime).toISOString().slice(0, 10)
        : "Today "
    }
    ${
      new Date(task.dueDateTime).getHours() === 0
        ? 12
        : new Date(task.dueDateTime).getHours() > 12
        ? Math.abs(new Date(task.dueDateTime).getHours() - 12)
        : new Date(task.dueDateTime).getHours()
    }: 

    ${new Date(task.dueDateTime).getMinutes().toString().padStart(2, "0")} 

    ${new Date(task.dueDateTime).getHours() >= 12 ? "PM" : "AM"}`;

  if (startLabels[index]) startLabels[index].textContent = "End";

  if (remainingTimeElements[index])
    remainingTimeElements[index].innerHTML = ` ${
      remainingDays
        ? remainingDays > 1
          ? remainingDays + "days "
          : remainingDays + "day "
        : ""
    } 
      ${remainingHours ? (remainingHours % 24) + "h " : ""} 

      ${(remainingMinutes % 60).toString().padStart(2, "0") + "m "}  
       
    <span id="duration-seconds">${
      (remainingSeconds % 60).toString().padStart(2, "0") + "s"
    }</span>
    
  `;
};
