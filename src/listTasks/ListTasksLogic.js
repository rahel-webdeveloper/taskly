import { saveLocalStorage } from "../data/localStorage";
import { isDashboardOpen } from "../pages/dashboard/MainDashboard";
import { addAngleBracket, updateTaskCount } from "./ListTasksRender";
import {
  completingTask,
  deletingCompleteTasks,
  deletingTask,
  editingTask,
  Id,
  listTasks,
  liveTasks,
  onSelectedState,
  saveEditedTask,
  setLiveTasks,
  tasksState,
  todayTasks,
  visibleTasks,
} from "./store";

const ListTasksLogic = () => {
  const listTasksContainer = document.getElementById("task-list_container");

  if (listTasksContainer)
    listTasksContainer.addEventListener("click", function (event) {
      eventsHandler(event);
      // DashboardLogic();
    });

  onSelectedState(
    !isDashboardOpen.get() ? liveTasks.get() : listTasks.get(),
    tasksState.get()
  );
};

// Events handler function
const eventsHandler = (event) => {
  const customSelect = document.getElementById("custom_select");
  const filterList = document.getElementById("filter_list");
  const filterOptions = document.querySelectorAll(".option");
  const filterNameShowEl = document.querySelector(".state-name");

  const editBox = document.querySelector(".task-edit-box");
  const editInput = document.getElementById("task-edit-input");

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

      onSelectedState(
        !isDashboardOpen.get() ? liveTasks.get() : listTasks.get(),
        option.dataset.value
      );

      filterList.style.display = "none";

      // Adding the angle brackets
      addAngleBracket(
        filterOptions,
        option.dataset.value,
        filterNameShowEl.dataset.value
      );
    });
  });

  if (isDashboardOpen.get()) {
    const askDiv = document.querySelector(".delete-ask-div");
    const askDivStyle = askDiv.style;

    if (target.closest(".all-delte-btn") && listTasks.get().length !== 0)
      askDivStyle.display = "block";
    // Ask for deleting all done tasks
    if (target.closest("#no")) askDivStyle.display = "none";

    if (target.closest("#yes")) {
      askDivStyle.display = "none";

      deletingCompleteTasks();
    }
  }
};

// today's report
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

// updateViewOnTask
export function updateViewOnTask() {
  setLiveTasks(listTasks.get());

  onSelectedState(
    !isDashboardOpen.get() ? liveTasks.get() : listTasks.get(),
    tasksState.get()
  );

  saveLocalStorage(listTasks.get(), "listTask");
  updateTaskCount(listTasks.get(), visibleTasks.get().length);
  todayReport(todayTasks.get());
}

export default ListTasksLogic;
