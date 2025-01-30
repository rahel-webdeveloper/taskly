import TaskEvents, {
  listTask,
  Id,
  stateName,
  visibleTasks,
  startTime,
  endTime,
  startAmPm,
  endAmPm,
} from "./store.js";
import {
  addTaskToHtml,
  addToDetailsCard,
  showPercentage,
} from "./TaskRender.js";
import { addCheck } from "./TaskRender.js";
import { priorityIcons, priorityColors } from "../../services/helper.js";

const {
  completingTask,
  deletingTask,
  editingTask,
  saveEditedTask,
  onSelectedState,
  deletingCompleteTasks,
} = TaskEvents;

export default function constTasksLogic() {
  const constTasksSection = document.getElementById("const-tasks-section");

  if (constTasksSection) {
    constTasksSection.addEventListener("click", eventsHandler);

    onSelectedState(listTask.get(), stateName.get());
    submitFornFunc();
    updateViewOnTask();
  }
}

// Events hadler function
const eventsHandler = (event) => {
  const customSelect = document.getElementById("custom_select");
  const filterList = document.getElementById("filter_list");
  const filterOptions = document.querySelectorAll(".option");
  const stateElement = document.querySelector(".state-name");

  const editBox = document.querySelector(".task-edit-box");
  const editInput = document.getElementById("task-edit-input");

  const askDiv = document.querySelector(".delete-ask-div");
  const askDivStyle = askDiv.style;

  const target = event.target;
  const getAttributeId = target.getAttribute("data-id");

  if (target.closest(".complete-icon-svg")) {
    Id.set(getAttributeId);
    completingTask();
  }

  if (target.closest(".delete-icon-svg")) {
    Id.set(getAttributeId);
    deletingTask();
  }

  if (target.closest(".edit-icon-div")) {
    Id.set(getAttributeId);
    editingTask(editBox, editInput);
  }

  if (target.closest("#save")) saveEditedTask(editInput, editBox);

  if (target.closest("#cancel")) editBox.style.display = "none";

  // Toggle filter box
  if (target.closest(".selected-option"))
    filterList.style.display =
      filterList.style.display === "block" ? "none" : "block";

  // Hide filter box because of out event
  if (!customSelect.contains(target)) filterList.style.display = "none";

  filterOptions.forEach((option) => {
    option.addEventListener("click", function () {
      stateElement.textContent = option.dataset.value + " tasks";
      stateElement.dataset.value = option.dataset.value;

      onSelectedState(listTask.get(), option.dataset.value);

      filterList.style.display = "none";

      // Adding the angle brackets
      addCheck(filterOptions, option.dataset.value, stateElement.dataset.value);
    });
  });

  if (target.closest(".all-delte-btn") && listTask.get().length !== 0)
    askDivStyle.display = "block";

  // Ask for deleting all complete tasks
  if (target.closest("#no")) askDivStyle.display = "none";

  if (target.closest("#yes")) {
    askDivStyle.display = "none";

    deletingCompleteTasks();
  }
};

function submitFornFunc() {
  const form = document.getElementById("form");
  const cateErrEl = document.getElementById("category-error");
  const timeErrEl = document.getElementById("time-error");
  const prioErrEl = document.getElementById("priority-error-message");

  let [priority, priorityColor, priorityIcon] = [0, "", ""];

  // Taking the priority data
  const priorityKeys = document.querySelectorAll(".priority-of-task span");
  priorityKeys.forEach((key, index) => {
    key.addEventListener("click", function () {
      priority = parseInt(key.getAttribute("data-priority"));

      priorityColor = priorityColors[index + 1];
      priorityIcon = priorityIcons[index + 1];

      nullValidation(priority, prioErrEl);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let formData = new FormData(form);

    const startCheckbox = formData.get("startTimeCheckbox");
    const endCheckbox = formData.get("endTimeCheckbox");
    timeCalculation.findAmPm(startCheckbox, endCheckbox);

    startTime.set(
      timeCalculation.convertTo24Hour(
        parseInt(formData.get("startHour")),
        parseInt(formData.get("startMinutes")),
        startAmPm.get()
      )
    );

    endTime.set(
      timeCalculation.convertTo24Hour(
        parseInt(formData.get("endHour")),
        parseInt(formData.get("endMinutes")),
        endAmPm.get()
      )
    );

    const categoryValue = formData.get("category");

    if (!nullValidation(categoryValue, cateErrEl)) return;

    if (!nullValidation(priority, prioErrEl)) return;

    if (!validationOfEqualTime(startTime.get(), endTime.get(), timeErrEl))
      return;

    // Calculate total time differece
    const { hours, minutes } = timeCalculation.calculateTimeDifference(
      startTime.get(),
      endTime.get()
    );

    // Adding custome data to Form Data
    formData.append("minutesDifference", minutes);
    formData.append("hourDifference", hours);
    formData.append("taskPrioriy", priority);
    formData.append("priorityColor", priorityColor);
    formData.append("priorityIcon", priorityIcon);
    formData.append("startAmPm", startAmPm.get());
    formData.append("endAmPm", endAmPm.get());

    // Convert formData Object to JS regular object
    let objFormData = Object.fromEntries(formData.entries());
    addTask(objFormData);

    // reset form
    form.reset();
    priority = 0;
  });

  form.addEventListener("change", function () {
    validationOfFormData(priority);
  });
}

class TimeCalculation {
  findAmPm(startCheckbox, endCheckbox) {
    !startCheckbox ? startAmPm.set("AM") : startAmPm.set("PM");
    !endCheckbox ? endAmPm.set("AM") : endAmPm.set("PM");
  }

  convertTo24Hour(hours, minutes, amPm) {
    if (amPm === "PM" && hours !== 12) hours += 12;
    if (amPm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  calculateTimeDifference(startTime, endTime) {
    if (endTime < startTime) endTime += 24 * 60;

    const TotalMinutesDifferece = endTime - startTime;
    const hours = Math.floor(TotalMinutesDifferece / 60);
    const minutes = TotalMinutesDifferece % 60;

    return { hours, minutes };
  }

  currentDate() {
    let nowDate = new Date(),
      minutes = nowDate.getMinutes(),
      hours = nowDate.getHours(),
      amPm = "AM";

    if (minutes < 10) minutes += "0";

    if (hours > 12) {
      (amPm = "PM"), (hours = Math.abs(hours - 12));
    }
    return { hours, minutes, amPm };
  }
}

const timeCalculation = new TimeCalculation();

// Add task to list logic
function addTask(formData) {
  const currentTime = timeCalculation.currentDate();
  const currentHours = currentTime.hours;
  const currentMinutes = currentTime.minutes;
  const currentAmPm = currentTime.amPm;

  // Structure of task data
  listTask.set([
    {
      ...formData,
      state: "active",
      id: self.crypto.randomUUID(),
      currentHours,
      currentMinutes,
      currentAmPm,
    },
    ...listTask.get(),
  ]);

  updateViewOnTask();
}

// local storage
export function saveLocalStorage(tasks) {
  localStorage.setItem("listTask", JSON.stringify(tasks));
}

export function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem("listTask"));
}

// Validation of data
function validationOfFormData(priority) {
  const desErrEl = document.getElementById("description-error");
  const cateErrEl = document.getElementById("category-error");
  const prioErrEl = document.getElementById("priority-error-message");

  const categoryValue = document.getElementById("category").value;
  const taskFormValue = document.getElementById("taskForm").value;

  taskFormValue.length < 7
    ? (desErrEl.style.opacity = "1")
    : (desErrEl.style.opacity = "0");

  nullValidation(categoryValue, cateErrEl);
  nullValidation(priority, prioErrEl);
  timeValidation();
}

function timeValidation() {
  const timeErrEl = document.getElementById("time-error");

  const startHours = document.getElementById("start_hours").value;
  const endHours = document.getElementById("end_hours").value;
  const startMinutes = document.getElementById("start_minutes").value;
  const endMinutes = document.getElementById("end_minutes").value;

  if (
    startHours < 1 ||
    startHours > 12 ||
    endHours < 1 ||
    endHours > 12 ||
    startMinutes < 0 ||
    startMinutes > 59 ||
    endMinutes < 0 ||
    endMinutes > 59
  ) {
    timeErrEl.textContent = "Please enter valid time.";
    timeErrEl.style.opacity = "1";
    return;
  }
  timeErrEl.style.opacity = "0";
}

function validationOfEqualTime(startTime, endTime, timeErrEl) {
  if (startTime === endTime) {
    timeErrEl.textContent = "Time should be not equal.";
    timeErrEl.style.opacity = "1";
    return false;
  } else {
    timeErrEl.style.opacity = "0";
    return true;
  }
}

function nullValidation(elementValue, erroreEl) {
  if (!elementValue) {
    erroreEl.style.opacity = "1";
    return false;
  } else {
    erroreEl.style.opacity = "0";
    return true;
  }
}

// updateViewOnTask
export function updateViewOnTask() {
  addTaskToHtml(visibleTasks.get());
  onSelectedState(listTask.get(), stateName.get());
  saveLocalStorage(listTask.get());
  showPercentage(listTask.get());
  addToDetailsCard(listTask.get());
}
