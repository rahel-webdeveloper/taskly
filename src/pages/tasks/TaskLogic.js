import flatpickr from "flatpickr";
import { updateViewOnTask } from "../../listTasks/ListTasksLogic.js";
import {
  category,
  check_Time_AllDay,
  durationMinutes,
  startDateTime,
  dueDateTime,
  listTasks,
  priority,
  taskDescription,
} from "../../listTasks/store";
import {
  priorityColors,
  priorityIcons,
  priorityLabels,
} from "../../services/helper.js";

export default function TasksLogic() {
  const constTasksSection = document.getElementById("const-tasks-section");
  const toggle_El_Time_AllDay = document.getElementById("checkbox");

  if (constTasksSection) {
    toggle_El_Time_AllDay.addEventListener("click", function () {
      checkTimeAllDay(this.checked);
    });

    useFlatepickr();
    submitForm();
    updateViewOnTask();
  }
}

const checkTimeAllDay = (checkTimeDay) => {
  document.getElementById("start_date-time").value = "";
  document.getElementById("due_date-time").value = "";

  check_Time_AllDay.set(checkTimeDay);
  useFlatepickr();
};

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

const useFlatepickr = () => {
  let starteDateTimeConfig = {
    enableTime: true,
    noCalendar: true,
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

function calculateTimeDifference(startTime, dueTime) {
  const res = Math.abs(dueTime - startTime);
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

function timeValidation() {
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
      "The due datetime must be greather than start datetime!";

    return false;
  } else if (startDateTime === dueDateTime) {
    timeErrEl.style.opacity = "1";

    timeErrEl.textContent = "The time should be not equal!";

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

// Add task to task list
function addTaskData() {
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
      description: taskDescription.get(),
      category: category.get(),
      startDateTime: startDateTime.get(),
      dueDateTime: dueDateTime.get(),
      durationMinutes: durationMinutes.get(),
      priority: {
        level: priority.get().level,
        label: priority.get().label,
        color: priority.get().color,
        icon: priority.get().icon,
      },
      state: "on-hold",
      isCompleted: false,
      is_All_Day: check_Time_AllDay.get(),
      updatedAt: updatedAt.toISOString(),
    },
    ...listTasks.get(),
  ]);

  updateViewOnTask();
}

// Card logic
const durationInterval = setInterval(() => {
  listTasks.get().map((task) => {
    const now = new Date().getTime();
    const startDateTime = new Date(task.startDateTime).getTime();
    const dueDateTime = new Date(task.dueDateTime).getTime();

    if (dueDateTime > now) {
      if (now >= startDateTime) {
        console.log("That is equal!");
      }
    }
  });
}, 1000);
