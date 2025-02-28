import TaskEvents, {
  Id,
  taskDescription,
  category,
  priority,
  stateName,
  visibleTasks,
  startTime,
  endTime,
  durationMinutes,
  startAmPm,
  endAmPm,
} from "./store.js";
import {
  addTaskToHtml,
  addToDetailsCard,
  updateTaskCount,
} from "./TaskRender.js";
import { addAngleBracket } from "./TaskRender.js";
import {
  priorityIcons,
  priorityColors,
  priorityLabels,
} from "../../services/helper.js";
import { listTask } from "../../App.js";

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
    submitForm();
    updateViewOnTask();
  }
}

// Events hadler function
const eventsHandler = (event) => {
  const customSelect = document.getElementById("custom_select");
  const filterList = document.getElementById("filter_list");
  const filterOptions = document.querySelectorAll(".option");
  const filterNameShowEl = document.querySelector(".state-name");

  const editBox = document.querySelector(".task-edit-box");
  const editInput = document.getElementById("task-edit-input");

  const askDiv = document.querySelector(".delete-ask-div");
  const askDivStyle = askDiv.style;

  const target = event.target;
  const getAttributeId = target.getAttribute("data-id");

  if (target.closest(".check-icon")) {
    Id.set(getAttributeId);
    completingTask();
  }

  if (target.closest(".delete-icon")) {
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
      filterNameShowEl.textContent = `${
        (option.dataset.value === "all" && "All") ||
        (option.dataset.value === "done" && "Done") ||
        (option.dataset.value === "in-progress" && "In progress") ||
        (option.dataset.value === "on-hold" && "On hold")
      } Tasks`;
      filterNameShowEl.dataset.value = option.dataset.value;

      onSelectedState(listTask.get(), option.dataset.value);

      filterList.style.display = "none";

      // Adding the angle brackets
      addAngleBracket(
        filterOptions,
        option.dataset.value,
        filterNameShowEl.dataset.value
      );
    });
  });

  if (target.closest(".all-delte-btn") && listTask.get().length !== 0)
    askDivStyle.display = "block";

  // Ask for deleting all done tasks
  if (target.closest("#no")) askDivStyle.display = "none";

  if (target.closest("#yes")) {
    askDivStyle.display = "none";

    deletingCompleteTasks();
  }
};

function submitForm() {
  const form = document.getElementById("form");

  // Check validation
  form.addEventListener("change", function () {
    setPriorityData();
    setTimeData(form);
    validationOfFormData();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validationOfFormData()) {
      addTaskToList();

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

const setPriorityData = () => {
  const priorityKeys = document.querySelectorAll(".priority-of-task span");
  const prioErrEl = document.getElementById("priority-error-message");

  priorityKeys.forEach((key, index) => {
    key.addEventListener("click", function () {
      priority.set({
        level: parseInt(key.getAttribute("data-priority")),
        label: priorityLabels[index + 1],
        color: priorityColors[index + 1],
        icon: priorityIcons[index + 1],
      });

      nullValidation(priority.get().level, prioErrEl);
    });
  });
};

const setTimeData = (form) => {
  const formData = new FormData(form);

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

  durationMinutes.set(
    timeCalculation.calculateTimeDifference(startTime.get(), endTime.get())
  );
};

class TimeCalculation {
  findAmPm(startCheckbox, endCheckbox) {
    !startCheckbox ? startAmPm.set("AM") : startAmPm.set("PM");
    !endCheckbox ? endAmPm.set("AM") : endAmPm.set("PM");
  }

  convertTo24Hour(hours, minutes, amPm) {
    if (amPm === "PM" && hours !== 12) hours += 12;
    if (amPm === "AM" && hours === 12) hours = 0;

    const isoFormate = this.convertToISO(hours, minutes);

    return new Date(isoFormate);
  }

  convertToISO(hours, minutes) {
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);

    return hours && minutes && now.toISOString();
  }

  calculateTimeDifference(startTime, endTime) {
    const res = Math.abs(endTime - startTime);
    return res / 1000 / 60;
  }
}

const timeCalculation = new TimeCalculation();

// Validation of data
const validationOfFormData = () => {
  const desErrEl = document.getElementById("description-error");
  const cateErrEl = document.getElementById("category-error");
  const prioErrEl = document.getElementById("priority-error-message");

  const categoryValue = document.getElementById("category").value;
  const tasDescriptionValue = document.getElementById("task-description").value;

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

  // Set all validation
  if (
    nullValidation(categoryValue, cateErrEl) &&
    nullValidation(priority.get().level, prioErrEl) &&
    timeValidation()
  ) {
    category.set(categoryValue);
    return true;
  } else {
    return false;
  }
};

function timeValidation() {
  const timeErrEl = document.getElementById("time-error");

  const startHours = document.getElementById("start_hours").value;
  const endHours = document.getElementById("end_hours").value;
  const startMinutes = document.getElementById("start_minutes").value;
  const endMinutes = document.getElementById("end_minutes").value;

  if (startTime.get().getTime() === endTime.get().getTime()) {
    timeErrEl.textContent = "The time should be not equal.";
    timeErrEl.style.opacity = "1";

    return false;
  } else if (
    startHours &&
    startHours &&
    endHours &&
    endHours &&
    startMinutes &&
    startMinutes &&
    endMinutes &&
    endMinutes &&
    startTime.get().getTime() !== endTime.get().getTime()
  ) {
    timeErrEl.style.opacity = "0";

    return true;
  } else {
    timeErrEl.textContent = "Please enter valid time.";
    timeErrEl.style.opacity = "1";

    return false;
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

// Add task to task list
function addTaskToList() {
  const updatedAt = new Date();

  // Structure of task data
  listTask.set([
    {
      id: String(listTask.get().length + 1),
      description: taskDescription.get(),
      category: category.get(),
      startTime: startTime.get().toISOString(),
      endTime: endTime.get().toISOString(),
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
    ...listTask.get(),
  ]);

  updateViewOnTask();
}

// updateViewOnTask
export function updateViewOnTask() {
  addTaskToHtml(visibleTasks.get());
  onSelectedState(listTask.get(), stateName.get());
  saveLocalStorage(listTask.get());
  addToDetailsCard(listTask.get());
  updateTaskCount(listTask.get(), visibleTasks.get().length);
}

// local storage
export function saveLocalStorage(tasks) {
  localStorage.setItem("listTask", JSON.stringify(tasks));
}

export function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem("listTask"));
}
