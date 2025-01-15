// Const section main content
export default function ConstTasksRender() {
  return `
    <div class="const-tasks-section" id="const-tasks-section">
    <section class="first-section">
        <div class="form-container">
            <form action="" class="form" id="form">
                <div class="form-column">
                    <label for="task" id="description-label">Write your task description here.</label>
                    <input type="text" id="taskForm" name="description" minlength="7" maxlength="45"
                        placeholder="Write the description of task here" required></input>
                    <p class="error-message" id="description-error">The description must be at least 7 characters.</p>
                </div>
                <div class="form-row">
                    <div class="form-column">
                        <label for="category" id="select-label">Select category</label>
                        <select id="category" name="category">
                            <option value=""></option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                            <option value="coding">Coding</option>
                            <option value="desing">Desing</option>
                            <option value="exercise">Exercise</option>
                            <option value="social">Social</option>
                            <option value="play">Play</option>
                            <option value="other...">Other...</option>
                        </select>
                        <p class="error-message" id="category-error">Select at least one category.</p>
                    </div>
                    <div class="form-column">
                        <label for="priority" id="priority-label">Choose your task priority</label>
                        <div class="priority-of-task" id="priority_of_task">
                            <span data-priority="1" style="background-color: #cb9ca3;" tabindex="0">1</span>
                            <span data-priority="2" style="background-color: #bbb2cc;" tabindex="0">2</span>
                            <span data-priority="3" style="background-color: #e4b875;" tabindex="0">3</span>
                            <span data-priority="4" style="background-color: #86b5b2;" tabindex="0">4</span>
                            <span data-priority="5" style="background-color: #b0bbbc;" tabindex="0">5</span>
                        </div>
                        <p class="error-message" id="priority-error-message">Your task must have a priority.</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-column">
                        <div class="time-picker">
                            <label for="start-time_input" id="start-time-label">Start time</label>
                            <div class="time-input" id="start-time_input">
                                <input type="number" id="start_hours" name="startHour"
                                    title="Enter your task start hour." min="1" max="12" placeholder="HH" required>:
                                <input type="number" id="start_minutes" name="startMinutes"
                                    title="Enter your task start minutes." min="0" max="59" placeholder="MM" required>
                                <label class="switch-night-day">
                                    <input type="checkbox" name="startTimeCheckbox" id="checkbox">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div class="incremen-decrement-btns">
                            </div>
                        </div>
                    </div>
                    <p class="time-error-message" id="time-error">Please enter valid time.</p>
                    <div class="form-column">
                        <div class="time-picker">
                            <label for="end-time_input" id="end-time-label">End time</label>
                            <div class="time-input" id="end-time_input">
                                <input type="number" id="end_hours" name="endHour" title="Enter your task end hour."
                                    min="1" max="12" placeholder="HH" required>:
                                <input type="number" id="end_minutes" name="endMinutes"
                                    title="Enter your task end minutes." min="0" max="59" placeholder="MM" required>
                                <label class="switch-night-day">
                                    <input type="checkbox" name="endTimeCheckbox">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="create-btn" type="submit" id="create_btn">
                    Create Task
                    <img src="./src/assets/arrow-down-right-svgrepo-com.svg" alt="">
                </button>
            </form>
        </div>
    </section>
    <section class="second-section">
        <div class="card-container">
            <div class="details-cards" id="details_cards">
                <!-- New task card will appear here -->
            </div>
        </div>
        <div class="task-list-container">
            <div class="filter-and-length">
                <div class="custom-select" id="custom_select">
                    <div class="selected-option" id="selected_option">
                        <p class="state-name" data-value="all">Filter tasks</p>
                        <svg class="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                        </svg>
                    </div>
                    <div class="filter-list" id="filter_list">
                        <span class="option" data-value="all"> > All Tasks</span>
                        <span class="option" data-value="active">Active Tasks</span>
                        <span class="option" data-value="complete">Complete Tasks</span>
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
            <div class="all-delete-div" id="delete_all_tasks">
                <span title="Delete all your complete tasks tasks!" class="all-delte-btn"><img
                        src="src/assets/trash-svgrepo-com.svg" class="all-delte-icon" alt=""></span>
            </div>
            <div class="delete-ask-div">
                <h3 class="ask-div-header">Are sure you want to delete all your complete tasks?</h3>
                <div class="ask-btns">
                    <button id="no" class="ask-div-btn">No</button>
                    <button id="yes" class="ask-div-btn">Yes</button>
                </div>
            </div>
        </div>
    </section>
    <section class="third-section">
        <div class="percent-of-task">
            <div class="circle-percent">
                <div class="circle">
                    <div class="all-task">
                        <h2 id="all_task">0</h2>
                    </div>
                </div>
                <h3>All Tasks</h3>
            </div>
            <div class="circle-percent">
                <div class="circle color-percentage">
                    <div class="active-task">
                        <h2 id="active_task">70%</h2>
                    </div>
                </div>
                <h3>Active</h3>
            </div>
            <div class="circle-percent">
                <div class="circle color-percentage">
                    <div class="complete-task">
                        <h2 id="complete_task">30%</h2>
                    </div>
                </div>
                <h3>Complete</h3>
            </div>
        </div>
    </section>
</div>
    `;
}

export function addTaskToHtml(tasks) {
  const list = document.getElementById("task-list-div");
  list.innerHTML =
    tasks.length === 0
      ? `<div class="no-data-img"><img src="../src/assets/empty-box.png" style="width: 35%;" alt=""></div>`
      : tasks.map(taskToHTML).join("");
}

function taskToHTML(task) {
  return `
    <li class="${task.state} list-task">
      <div class="list-task-div">
        <div class="complete-icon-div" title="complete or uncomplete task">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="complete-icon-svg" data-id="${task.id}">
            <PATh d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
          </svg>
        </div>
        <div class="task-description-div">
          <p>${task.description}</p>
          <span class='task-current-time'>${task.currentHours}: ${task.currentMinutes} ${task.currentAmPm}</span>
        </div>

        <div class="task-left-div" title="edit task">
          <div class="edit-icon-div">
            <i class="ri-edit-circle-fill task-edit-icon" data-id="${task.id}"></i>
          </div>

        <div class="delete-icon-div" title="delete task">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="delete-icon-svg" data-id="${task.id}">
            <PATh d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
          </svg>
        </div>

      </div>
        
      </div>
    </li>
  `;
}

// Update task count
export function updateTaskCount(allCount, visibleCount) {
  const allTaskLenght = document.getElementById("all_task");
  const filterTaskLenght = document.getElementById("length");
  if (allTaskLenght !== null && filterTaskLenght !== null) {
    allTaskLenght.textContent = allCount;
    filterTaskLenght.textContent = visibleCount;
  }
}

// Show Percentage
export function showPercentage(tasks) {
  const activePercentageEl = document.getElementById("active_task");
  const completePercentageEl = document.getElementById("complete_task");
  const colorPercentage = document.querySelectorAll(".color-percentage");

  // Percentages of active and complete tasks
  let PAT = 0;
  let PCT = 0;

  if (tasks.length === 0) {
    activePercentageEl.textContent = 0 + "%";
    completePercentageEl.textContent = 0 + "%";
  } else {
    //Active percent of task
    const filterA = tasks.filter((task) => task.state === "active");
    PAT = Math.floor((filterA.length / tasks.length) * 100);
    activePercentageEl.textContent = PAT + "%";

    //Complete percent of task
    const filterC = tasks.filter((task) => task.state === "complete");
    PCT = Math.floor((filterC.length / tasks.length) * 100);
    completePercentageEl.textContent = PCT + "%";
  }

  //Calculating percentage base on degree
  let activeDegree = Math.floor((PAT / 100) * 360);
  let completeDegree = Math.floor((PCT / 100) * 360);

  //circle percentage
  colorPercentage[0].style.background = `conic-gradient(#3e425d 0deg ${
    360 - activeDegree
  }deg, #edc07b ${360 - activeDegree}deg 360deg)`;
  colorPercentage[1].style.background = `conic-gradient(#3e425d 0deg ${
    360 - completeDegree
  }deg, #90dcd6 ${360 - completeDegree}deg 360deg)`;
}

// Adding angle brackets in filter
export function addCheck(option, optionValue, nameVlue) {
  for (let i = 0; i < option.length; i++) {
    option[i].dataset.value === nameVlue
      ? (option[i].innerHTML =
          "<span style='color: #8ce5f4'> > </span>" + optionValue)
      : (option[i].textContent = option[i].dataset.value);
  }
}

export function addToDetailsCard(tasks) {
  const parentCardEl = document.getElementById("details_cards");
  parentCardEl.innerHTML = "";
  if (tasks.length !== 0) {
    tasks.forEach((task) => {
      parentCardEl.innerHTML += `
  
       <div class="details-card" style="background-color: ${
         task.priorityDetails.priorityColor
       };">
          <div class="task-details">
            <div class="task-title">
              <h3 id="task-desc">${
                task.description.length > 17
                  ? task.description.slice(0, 17) + ". . ."
                  : task.description
              }</h3>
              <span id="category">${task.category}</span>
            </div>
            <div class="priority-icon">
              <img src="${task.priorityDetails.priorityIcon}" alt="">
            </div>
          </div>
          <div class="task-time">
            <div class="task-start-time">
              <h3 class="start-time">${
                task.taskStartTime.startHours +
                ": " +
                task.taskStartTime.startMinutes +
                " " +
                task.taskStartTime.startAmPm
              }</h3>
              <p>Start</p>
            </div>
            <div class="task-done-time"><span>${
              task.differenceTime.diffrenceHours +
              task.differenceTime.diffrenceMinutes
            }</span></div>
            <div class="task-end-time">
              <h3 class="end-time">${
                task.taskEndTime.endHours +
                ": " +
                task.taskEndTime.endMinutes +
                " " +
                task.taskEndTime.endAmPm
              }</h3>
              <p>End</p>
            </div>
          </div>
        </div> 
       `;

      parentCardEl.style.gridTemplateColumns = `repeat(${
        tasks.length + 1
      }, 1fr)`;
    });

    // Style base on overflow
    const detailsCard = document.querySelectorAll(".details-card");
    tasks.length === 1
      ? (detailsCard[0].style.margin = ".5rem")
      : (detailsCard[0].style.margin = "0rem");
  } else {
    parentCardEl.innerHTML = `
      <div class="details-card empty-card">
          <div class="task-details">
            <div class="task-title">
              <h3>........................</h3>
              <span>--------------</span>
            </div>
            <div class="priority-icon">
              <img src="./src/assets/flag.png" alt="">
            </div>
          </div>
          <div class="task-time">
            <div class="task-start-time">
              <h3 class="start-time">0: 00 PM</h3>
              <p>Start</p>
            </div>
            <div class="task-done-time"><span>00 Min</span></div>
            <div class="task-end-time">
              <h3 class="end-time">0: 00 AM</h3>
              <p>End</p>
            </div>
          </div>
        </div>
      `;

    // Style base on overflow
    const emptyCard = document.querySelector(".empty-card");
    tasks.length === 0
      ? (emptyCard.style.margin = ".5rem")
      : (emptyCard.style.margin = "0rem");
  }
}

// sidebar show
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarMenu = document.querySelector(".sidebar-menu");
const menuIcon = document.querySelector(".menu");

sidebarToggle.addEventListener("click", showSidbar);
function showSidbar() {
  menuIcon.classList.toggle("ri-menu-line");
  menuIcon.classList.toggle("ri-menu-4-line");
  sidebarMenu.classList.toggle("sidebar-show");
}
