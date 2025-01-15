// Validation of data
export function validationOfFormData(priority) {
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

export function validationOfEqualTime(startTime, endTime, timeErrEl) {
  if (startTime === endTime) {
    timeErrEl.textContent = "Time should be not equal.";
    timeErrEl.style.opacity = "1";
    return false;
  } else {
    timeErrEl.style.opacity = "0";
    return true;
  }
}

export function nullValidation(elementValue, erroreEl) {
  if (!elementValue) {
    erroreEl.style.opacity = "1";
    return false;
  } else {
    erroreEl.style.opacity = "0";
    return true;
  }
}
