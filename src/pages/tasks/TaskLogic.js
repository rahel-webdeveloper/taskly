import { listTasks } from "../../listTasks/store";
import { updateViewOnTask } from "../../listTasks/ListTasksLogic.js";
import {
  category,
  durationMinutes,
  endAmPm,
  endTime,
  priority,
  startAmPm,
  startTime,
  taskDescription,
} from "../../listTasks/store";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../services/helper.js";
import flatpickr from "flatpickr";

export default function TasksLogic() {
  const constTasksSection = document.getElementById("const-tasks-section");

  if (constTasksSection) {
    submitForm();
    updateViewOnTask();
  }
}

function submitForm() {
  const form = document.getElementById("form");

  // Check validation
  form.addEventListener("change", function () {
    setPriorityData();
    validationOfFormData();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validationOfFormData()) {
      addTaskData();

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

document.addEventListener("DOMContentLoaded", function () {
  const startTimePicker = flatpickr("#start_date-time", {
    enableTime: true,
    noCalendar: false,
    dateFormat: "Y-m-d h:i K",
    time_24hr: false,
    disableMobile: true,
    position: "auto center",

    onChange: function (selectedDates, dateStr) {
      const now = new Date(selectedDates);
      startTime.set(now);
    },
  });

  const dueTimePicker = flatpickr("#due_date-time", {
    enableTime: true,
    noCalendar: false,
    dateFormat: "Y-m-d h:i K",

    time_24hr: false,
    disableMobile: true,
    position: "auto center",

    onChange: function (selectedDates, dateStr) {
      const now = new Date(selectedDates);
      endTime.set(now);
    },
  });
});

durationMinutes.set(calculateTimeDifference(startTime.get(), endTime.get()));

function calculateTimeDifference(startTime, endTime) {
  const res = Math.abs(endTime - startTime);
  return res / 1000 / 60;
}

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

  const startDateTime = document.getElementById("start_date-time").value;
  const dueDateTime = document.getElementById("due_date-time").value;

  if (!startDateTime && !dueDateTime) {
    timeErrEl.style.opacity = 1;
    timeErrEl.style.bottom = "0%";

    timeErrEl.textContent = "Please enter valid time.";

    return false;
  } else if (
    new Date(startDateTime).getTime() > new Date(dueDateTime).getTime()
  ) {
    timeErrEl.style.opacity = "1";
    timeErrEl.style.bottom = "-15%";

    timeErrEl.textContent =
      "The due datetime must be greather than start datetime.";

    return false;
  } else if (
    new Date(startDateTime).getTime() === new Date(dueDateTime).getTime()
  ) {
    timeErrEl.style.opacity = "1";
    timeErrEl.style.bottom = "%0";

    timeErrEl.textContent = "The time should be not equal.";

    return false;
  } else {
    timeErrEl.style.bottom = "%0";
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

// Add task to task list
function addTaskData() {
  const updatedAt = new Date();

  // Structure of task data
  listTasks.set([
    {
      id: String(listTasks.get().length + 1),
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
    ...listTasks.get(),
  ]);

  updateViewOnTask();
}
