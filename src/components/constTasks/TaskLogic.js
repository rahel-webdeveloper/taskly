import { listTask, deleteAll } from "./ConstTasks.js";
import {
  addTaskToHtml,
  addToDetailsCard,
  showPercentage,
} from "./TaskRender.js";
import { updateTaskCount, addCheck } from "./TaskRender.js";
import { priorityIcons, priorityColors } from "../../services/helper.js";

let stateName = "all";
let visibleTasks = [];
let taskId = 0;

let startTime;
let endTime;

let startAmPm = "AM";
let endAmPm = "PM";

export function ConstTasksLogic() {
  const constTasksSection = document.getElementById("const-tasks-section");
  if (constTasksSection) {
    constTasksSection.addEventListener("click", function (event) {
      eventsHadler(event);
    });

    taskOperation.onSelectedState(listTask, stateName);
    submitFornFunc();
    updateViewOnTask();
  }
}

// Class tasks related operation
class TaskEventOperation {
  completingTask(id) {
    listTask.map((task, index) => {
      if (task.id === id) {
        listTask[index].state === "active"
          ? (listTask[index].state = "complete")
          : (listTask[index].state = "active");
      }
    });
    updateViewOnTask();
  }

  deleteTask(id) {
    const findIndex = listTask.findIndex((task) => task.id === id);
    listTask.splice(findIndex, 1);
    updateViewOnTask();
  }

  editTask(id, editBox, editInput) {
    taskId = id;
    const findTask = listTask.findIndex((task) => task.id === id);

    editBox.style.display = "flex";
    editInput.value = listTask[findTask].description;
  }

  onSelectedState(listTasks, state) {
    stateName = state;
    visibleTasks = taskOperation.getFilterTasks(listTasks, state);
    updateTaskCount(listTasks.length, visibleTasks.length);
    addTaskToHtml(visibleTasks);
  }

  getFilterTasks(listTask, state) {
    return state === "all"
      ? listTask
      : listTask.filter((task) => task.state === state.toLowerCase());
  }
}

const taskOperation = new TaskEventOperation();

// Events hadler function
function eventsHadler(event) {
  const customSelect = document.getElementById("custom_select");
  const filterList = document.getElementById("filter_list");
  const filterOptions = document.querySelectorAll(".option");
  const stateNameEl = document.querySelector(".state-name");

  const editBox = document.querySelector(".task-edit-box");
  const editInput = document.getElementById("task-edit-input");

  const askDiv = document.querySelector(".delete-ask-div");
  const askDivStyle = askDiv.style;

  if (event.target.closest(".complete-icon-svg")) {
    let id = event.target.getAttribute("data-id");
    taskOperation.completingTask(id);
  }
  if (event.target.closest(".delete-icon-svg")) {
    let id = event.target.getAttribute("data-id");
    taskOperation.deleteTask(id);
  }
  if (event.target.closest(".edit-icon-div")) {
    let id = event.target.getAttribute("data-id");
    taskOperation.editTask(id, editBox, editInput);
  }

  if (event.target.closest("#cancel")) editBox.style.display = "none";
  if (event.target.closest("#save")) {
    listTask.map((task) => {
      if (task.id === taskId && editInput.value.length > 7) {
        task.description = editInput.value;
        editBox.style.display = "none";
        updateViewOnTask();
      }
    });
  }

  if (event.target.closest(".selected-option")) {
    filterList.style.display =
      filterList.style.display === "block" ? "none" : "block";
  }

  // Filter event
  document.addEventListener("click", function (e) {
    if (!customSelect.contains(e.target)) filterList.style.display = "none";
  });

  filterOptions.forEach((option) => {
    option.addEventListener("click", function () {
      stateNameEl.textContent = option.dataset.value + " tasks";
      stateNameEl.dataset.value = option.dataset.value;
      taskOperation.onSelectedState(listTask, option.dataset.value);
      filterList.style.display = "none";
      // Adding the angle brackets
      addCheck(filterOptions, option.dataset.value, stateNameEl.dataset.value);
    });
  });

  if (event.target.closest(".all-delte-btn") && listTask.length !== 0)
    askDivStyle.display = "block";

  if (event.target.closest("#no")) askDivStyle.display = "none";

  if (event.target.closest("#yes")) {
    askDivStyle.display = "none";
    deleteAll();
    updateViewOnTask();
  }
}

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

    const startHours = parseInt(formData.get("startHour"));
    const startMinutes = parseInt(formData.get("startMinutes"));
    startTime = timeCalculation.convertTo24Hour(
      startHours,
      startMinutes,
      startAmPm
    );

    const endHours = parseInt(formData.get("endHour"));
    const endMinutes = parseInt(formData.get("endMinutes"));
    endTime = timeCalculation.convertTo24Hour(endHours, endMinutes, endAmPm);

    const categoryValue = formData.get("category");

    if (!nullValidation(categoryValue, cateErrEl)) return;
    if (!nullValidation(priority, prioErrEl)) return;
    if (!validationOfEqualTime(startTime, endTime, timeErrEl)) return;

    // Calculate total time differece
    const { hours, minutes } = timeCalculation.calculateTimeDifference(
      startTime,
      endTime
    );

    // Adding custome data to Form Data
    formData.append("minutesDifference", minutes);
    formData.append("hourDifference", hours);
    formData.append("taskPrioriy", priority);
    formData.append("priorityColor", priorityColor);
    formData.append("priorityIcon", priorityIcon);
    formData.append("startAmPm", startAmPm);
    formData.append("endAmPm", endAmPm);

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
    !startCheckbox ? (startAmPm = "AM") : (startAmPm = "PM");
    !endCheckbox ? (endAmPm = "AM") : (endAmPm = "PM");
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
      amPm = "PM";
      hours = Math.abs(hours - 12);
    }
    return { hours, minutes, amPm };
  }

  processNum(startMinutes, endMinutes, diffrenceHours, diffrenceMinutes) {
    if (parseInt(diffrenceHours) <= 0) diffrenceHours = "";
    if (parseInt(diffrenceMinutes) <= 0) diffrenceMinutes = "";
    if (parseInt(diffrenceMinutes) > 0 && parseInt(diffrenceHours) > 0)
      diffrenceHours += " & ";

    startMinutes < 10 ? (startMinutes = "0" + startMinutes) : startMinutes;
    endMinutes < 10 ? (endMinutes = "0" + endMinutes) : endMinutes;

    return { startMinutes, endMinutes, diffrenceHours, diffrenceMinutes };
  }
}

const timeCalculation = new TimeCalculation();

// Calculating time

// Add task to list logic
function addTask(formData) {
  const description = formData.description;
  const priority = formData.taskPrioriy;
  const priorityColor = formData.priorityColor;
  const priorityIcon = formData.priorityIcon;
  const category = formData.category;
  const startHours = formData.startHour;
  const startAmPm = formData.startAmPm;
  const endHours = formData.endHour;
  const endAmPm = formData.endAmPm;

  let endMinutes = formData.endMinutes;
  let startMinutes = formData.startMinutes;
  let diffrenceHours = formData.hourDifference + "h";
  let diffrenceMinutes = formData.minutesDifference + "m";

  ({ startMinutes, endMinutes, diffrenceHours, diffrenceMinutes } =
    timeCalculation.processNum(
      startMinutes,
      endMinutes,
      diffrenceHours,
      diffrenceMinutes
    ));
  const currentTime = timeCalculation.currentDate();
  const currentHours = currentTime.hours;
  const currentMinutes = currentTime.minutes;
  const currentAmPm = currentTime.amPm;

  // Structure of task data
  listTask.unshift({
    description,
    category,
    state: "active",
    id: self.crypto.randomUUID(),
    currentHours,
    currentMinutes,
    currentAmPm,

    priorityDetails: {
      priority,
      priorityIcon,
      priorityColor,
    },
    taskStartTime: {
      startHours,
      startMinutes,
      startAmPm,
    },
    taskEndTime: {
      endHours,
      endMinutes,
      endAmPm,
    },
    differenceTime: {
      diffrenceHours,
      diffrenceMinutes,
    },
  });
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

function updateViewOnTask() {
  addTaskToHtml(visibleTasks);
  taskOperation.onSelectedState(listTask, stateName);
  saveLocalStorage(listTask);
  showPercentage(listTask);
  addToDetailsCard(listTask);
}
