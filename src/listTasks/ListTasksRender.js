import { isDashboardOpen } from "../pages/dashboard/MainDashboard";

const TasksContainer = () => {
  return `
    <div class="task-list-container" id="task-list_container">
            <div class="filter-and-length">
                <div class="custom-select" id="custom_select">
                    <div class="selected-option" id="selected_option">
                        <p class="state-name" data-value="all">Filter Tasks</p>
                        <svg class="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                        </svg>
                    </div>
                    <div class="filter-list" id="filter_list">
                        <span class="option" data-value="all"> > all </span>
                        <span class="option" data-value="done">done </span>
                        <span class="option" data-value="in-progress">in-rogress </span>
                        <span class="option" data-value="on-hold">on-hold </span>
                    </div>
                </div>
                <div class="task-length">
                    <h4>Your tasks </h4>
                    <div class="length"><span id="length">0</span></div>
                </div>
            </div>
            <ul class="task-list-div" id="task-list-div">
                <!-- New task list will appear here -->
            </ul>
            <div class="task-edit-box">
                <input type="text" id="task-edit-input" placeholder="Write your edited task.">

                <div class="edit-result-btns">
                    <button id="cancel" class="edit-answer-btn">Cancel</button>
                    <button id="save" class="edit-answer-btn">Save</button>
                </div>
            </div>
            <div id="delete-done-task_div">
            
            </div>
        </div>
    `;
};

const deleteDiv = () => {
  document.addEventListener("DOMContentLoaded", function () {
    if (isDashboardOpen.get())
      document.getElementById("delete-done-task_div").innerHTML = `
          <div class="all-delete-div" id="delete_all_tasks">
                <span title="Delete all your done tasks tasks!" class="all-delte-btn"><img
                      src="https://www.svgrepo.com/show/529256/trash-bin-minimalistic.svg"  class="all-delte-icon"></span>
            </div>
            <div class="delete-ask-div">
            <span id="exclamation-icon"><i class="bi bi-patch-exclamation-fill"></i></span>
            <h3>Delete tasks</h3>
                <p class="ask-div-header">Are sure you want to delete all your done tasks? <br> it will never return back.</p>
                <div class="ask-btns">
                    <button id="no" class="ask-div-btn">No</button>
                    <button id="yes" class="ask-div-btn">Yes</button>
                </div>
            </div>
          `;
  });
};

deleteDiv();

const imgUrl = new URL("/empty-box.png", import.meta.url).href;

export function addTaskToList(tasks) {
  const list = document.getElementById("task-list-div");
  if (list)
    list.innerHTML =
      tasks.length === 0
        ? `<div class="no-data-img">
        <img src="${imgUrl}" id="empty-box" alt="img" />
        <h5>There is no task available!</h5>
        </div>`
        : tasks.map(newTaskRender).join("");
}

const newTaskRender = (task) => {
  return `
  <li class="${task.state} list-task">
    <div class="state-of-task">
      <p id="${task.state}-task">
      <i class="bi ${
        (task.state === "done" && "bi-star-fill") ||
        (task.state === "in-progress" && "bi-circle-fill") ||
        (task.state === "on-hold" && "bi-triangle-fill")
      }"></i>
        ${
          (task.state === "done" && "Done") ||
          (task.state === "in-progress" && "In progress") ||
          (task.state === "on-hold" && "On hold")
        }
      </p>
    </div>
    <div class="list-task-div">
      <div class="done-icon-div" title="done or uncomplete task">
        <i class="check-icon bi bi-check"
          data-id="${task.id}"></i>
      </div>
      <div class="task-description-div">
        <p>${task.description}</p>
        <span class="task-current-time">
          ${
            new Date(task.updatedAt).getHours() === 0
              ? 12
              : new Date(task.updatedAt).getHours() > 12
              ? Math.abs(new Date(task.updatedAt).getHours() - 12)
              : new Date(task.updatedAt).getHours()
          }
          : ${new Date(task.updatedAt).getMinutes().toString().padStart(2, "0")}
          ${new Date(task.updatedAt).getHours() >= 12 ? "PM" : "AM"}
        </span>
      </div>

      <div class="task-left-div" title="edit task">
        <div class="edit-icon-div">
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
  </li>`;
};

export function addAngleBracket(option, optionValue, nameVlue) {
  for (let i = 0; i < option.length; i++) {
    option[i].dataset.value === nameVlue
      ? (option[i].innerHTML =
          "<span style='color: #8ce5f4'> > </span>" + optionValue)
      : (option[i].textContent = option[i].dataset.value);
  }
}

// Update task count
export function updateTaskCount(totalTasks, visibleCount) {
  const filterTaskLenght = document.getElementById("length");

  if (filterTaskLenght) filterTaskLenght.textContent = visibleCount;
}

export default TasksContainer;
