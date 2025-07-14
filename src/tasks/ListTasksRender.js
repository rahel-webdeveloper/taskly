import DeleteCompleteTasksDiv, {
  askDialogDiv,
} from "../components/DeleteCompleteTasksDiv";
import ListTasksHeader from "../components/ListTasksHeader";
import TaskEditBox from "../components/TaskEdit";
import TaskStateDiv from "../components/TaskStateDiv";
import { isDashboardOpen } from "../routes";
import { eventsHandler } from "./ListTasksLogic";
import { filterState, implementFilter, listTasks, liveTasks } from "./store";

const TasksContainer = () => {
  return `
  <div class="task-list-container" id="task-list_container">
    ${ListTasksHeader()}
    <ul class="task-list-div" id="task-list-div">
      <!-- New task will appear here -->
    </ul>
    ${TaskEditBox()}
    <div id="delete-done-task_div">
    ${isDashboardOpen.get() ? DeleteCompleteTasksDiv() : ""}
    ${askDialogDiv()}
    </div>
  </div> `;
};

// Initialize events after rendering Tasks container
TasksContainer.init = function () {
  const listTasksContainer = document.getElementById("task-list_container");

  implementFilter(
    !isDashboardOpen.get() ? liveTasks.get() : listTasks.get(),
    filterState.get()
  );
  listTasksContainer.addEventListener("click", eventsHandler);
};

const imgUrl = new URL("/empty-box.png", import.meta.url).href;

export function addTaskToList(tasks) {
  const list = document.getElementById("task-list-div");
  if (list)
    list.innerHTML =
      tasks.length === 0
        ? `<div class="no-data-img" >
        <img src="${imgUrl}" id="empty-box" alt="img" />
        <h5>No ${
          filterState.get() === "all"
            ? ""
            : filterState.get() === "done"
            ? "done"
            : filterState.get() === "in-progress"
            ? "in progress"
            : "on hold"
        } tasks found!</h5>
         ${
           filterState.get() === "all"
             ? "<h5>Time to create new task.</h5>"
             : ""
         }
        </div> `
        : tasks.map(NewTaskRender).join("");
}

function formateDate(date) {
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(date).toLocaleString("default", options);
}

const NewTaskRender = (task) => {
  return `
  <li class="${task.state} list-task">
    ${TaskStateDiv(task.state)}
  <div class="list-task-div">
    <div title="done or uncomplete this task">
      <i class="check-icon bi bi-check"
        data-id="${task.id}"></i>
    </div>
    <div class="task-description-div">
      <p>${task.description.slice(0, 30) + "..."}</p>
      <span class="task-updated-time">
       ${formateDate(task.createdAt)}
      </span>
    </div>

    <div class="task-left-div" >
      <a href="/ai-advisor">
        <div class="assistance-task-icon-div" title="assistance to task">
          <i
            class="bi bi-stars assistance-task-icon"
            data-id="${task.id}"
          ></i>
        </div>
      </a>

      <div class="edit-icon-div" title="edit task">
        <i
          class="bi bi-input-cursor-text task-edit-icon"
          data-id="${task.id}"
        ></i>
      </div>

      <div class="delete-icon-div" title="delete task">
        <i class="delete-icon bi bi-dash"
          data-id="${task.id}"></i>
      </div>
    </div>
  </div>
  </ > `;
};

// Update task count
export function updateTaskCount(totalTasks, visibleCount) {
  const filterTaskLenght = document.getElementById("length");

  if (filterTaskLenght) filterTaskLenght.textContent = visibleCount;
}

export default TasksContainer;
