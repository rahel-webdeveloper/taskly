import { saveLocalStorage } from "../data/localStorage";

import { todayReport } from "../pages/taskHub/TaskHubLogic";
import { isDashboardOpen } from "../routes";
import openNotification from "../services/toastNotifications";
import { updateTaskCount } from "./tasksRender";
import {
  completingTask,
  deletingCompleteTasks,
  deletingTask,
  editingTask,
  filterState,
  implementFilter,
  implementSort,
  tasks,
  liveTasks,
  saveEditedTask,
  selectedTaskId,
  setLiveTasks,
  setTaskToAssitant,
  sortState,
  todayTasks,
  visibleTasks,
} from "./store";

// Events handler function
export const eventsHandler = (event) => {
  const panelFilter = document.getElementById("panel_filter");
  const panelSort = document.getElementById("panel_sort");

  const panelFilterControlls = document.getElementById(
    "panel__filter_controls"
  );
  const filterControllsOptions = document.querySelectorAll(
    "#panel_filter .option"
  );

  const sortControlsOptions = document.querySelectorAll("#panel_sort .option");

  const panelSortControls = document.getElementById("panel__sort_controls");

  const editBox = document.querySelector(".task-edit-box");
  const editInput = document.getElementById("task-edit-input");

  const target = event.target;
  const getAttributeId = target.getAttribute("data-id");

  if (target.closest(".check-icon")) {
    selectedTaskId.set(getAttributeId);
    completingTask();
  }

  if (target.closest(".delete-icon")) {
    selectedTaskId.set(getAttributeId);
    deletingTask();
  }

  if (target.closest(".assistance-task-icon-div")) {
    selectedTaskId.set(getAttributeId);
    setTaskToAssitant(selectedTaskId.get());
  }

  if (target.closest(".edit-icon-div")) {
    selectedTaskId.set(getAttributeId);
    editingTask(editBox, editInput);
  }

  if (target.closest("#save")) {
    saveEditedTask(editInput, editBox);

    openNotification("success", "Your edited task saved!");
  }

  if (target.closest("#cancel")) {
    editBox.style.display = "none";

    openNotification("error", "Your edited task cancelled!");
  }

  // Show filter panel
  if (target.closest(".panel--filter"))
    panelFilterControlls.style.display = "grid";

  // Show sort panel
  if (target.closest(".panel--sort")) panelSortControls.style.display = "grid";

  // Hide filter panel and sort panel because of out event
  if (!panelFilter.contains(target))
    panelFilterControlls.style.display = "none";

  if (!panelSort.contains(target)) panelSortControls.style.display = "none";

  filterControllsOptions.forEach((option) => {
    if (option.contains(target)) {
      implementFilter(
        !isDashboardOpen.get() ? liveTasks.get() : tasks.get(),
        option.dataset.value
      );
      addStyleToFilterControls();

      panelFilterControlls.style.display = "none";
    }
  });

  sortControlsOptions.forEach((option, idx) => {
    if (option.contains(target)) {
      const sortStateValue = idx === 0 ? "name" : "date";

      implementSort(
        !isDashboardOpen.get() ? liveTasks.get() : visibleTasks.get(),
        sortStateValue
      );
      addStyleToSortControls(idx);
      panelSortControls.style.display = "none";
    }
  });

  // If user was on dashboard page then add the delete complete tasks component
  if (isDashboardOpen.get()) {
    const askDeleteTasksDialog = document.getElementById(
      "ask_delete_tasks-dialog"
    );

    if (target.closest(".all-delete-btn") && tasks.get().length !== 0)
      askDeleteTasksDialog.showModal();

    if (target.closest("#no")) {
      askDeleteTasksDialog.close();

      openNotification("error", "Deleting done tasks cancelled!");
    }

    if (target.closest("#yes")) {
      askDeleteTasksDialog.close();

      deletingCompleteTasks();
      openNotification("success", "You deleted all your done tasks!");
    }
  }
};

// Add style base on tasks filter
export const addStyleToFilterControls = () => {
  const filterControlsOptions = document.querySelectorAll(
    "#panel__filter_controls .option"
  );

  filterControlsOptions.forEach((option) => {
    filterState.get() === option.dataset.value
      ? option.classList.add("added__filter")
      : option.classList.remove("added__filter");
  });
};

export const addStyleToSortControls = (idx = 1) => {
  const sortControlsOptions = document.querySelectorAll(
    "#panel__sort_controls .option"
  );

  sortControlsOptions.forEach((option, index) => {
    idx === index
      ? option.classList.add("added__sort")
      : option.classList.remove("added__sort");
  });
};

function filterAndSortFunc() {
  implementFilter(
    !isDashboardOpen.get() ? liveTasks.get() : tasks.get(),
    filterState.get()
  );
  implementSort(
    !isDashboardOpen.get() ? liveTasks.get() : visibleTasks.get(),
    sortState.get()
  );
}

function updateTaskUI() {
  updateTaskCount(tasks.get(), visibleTasks.get().length);
  todayReport(todayTasks.get());
}

// updateViewOnTask
export function controlTasksAllOperation() {
  setLiveTasks(tasks.get());
  filterAndSortFunc();
  saveLocalStorage(tasks.get(), "listTask");
  updateTaskUI();
}
