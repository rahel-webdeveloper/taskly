import {
  Id,
  stateName,
  visibleTasks,
  completingTask,
  deletingTask,
  deletingCompleteTasks,
  editingTask,
  saveEditedTask,
  onSelectedState,
} from "./store";
import { addTaskToList } from "./ListTasksRender";
import { addToDetailsCard, todayReport } from "../pages/tasks/TaskRender";
import { updateTaskCount, addAngleBracket } from "./ListTasksRender";
import { listTask } from "./store";
import DashboardLogic from "../pages/dashboard/DashboardLogic";
import { isDashboardOpen } from "../pages/dashboard/MainDashboard";

const ListTasksLogic = () => {
  const listTasksContainer = document.getElementById("task-list_container");

  if (listTasksContainer)
    listTasksContainer.addEventListener("click", function (event) {
      eventsHandler(event);
      // DashboardLogic();
    });

  onSelectedState(listTask.get(), stateName.get());
};

// Events hadler function
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

  if (isDashboardOpen.get()) {
    const askDiv = document.querySelector(".delete-ask-div");
    const askDivStyle = askDiv.style;

    if (target.closest(".all-delte-btn") && listTask.get().length !== 0)
      askDivStyle.display = "block";
    // Ask for deleting all done tasks
    if (target.closest("#no")) askDivStyle.display = "none";

    if (target.closest("#yes")) {
      askDivStyle.display = "none";

      deletingCompleteTasks();
    }
  }
};

// updateViewOnTask
export function updateViewOnTask() {
  addTaskToList(visibleTasks.get());
  onSelectedState(listTask.get(), stateName.get());
  saveLocalStorage(listTask.get());
  addToDetailsCard(listTask.get());
  updateTaskCount(listTask.get(), visibleTasks.get().length);
  todayReport(listTask.get());
}

// local storage
export function saveLocalStorage(tasks) {
  localStorage.setItem("listTask", JSON.stringify(tasks));
}

export function loadTasksFromStorage() {
  return JSON.parse(localStorage.getItem("listTask"));
}

export default ListTasksLogic;
