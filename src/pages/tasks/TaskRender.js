// Const section main content
export default function tasksRender() {
  return `
    <div class="const-tasks-section" id="const-tasks-section">
    <section class="first-section">
        <div class="form-container">
            <form action="" class="form" id="form">
                <div class="form-column">
                    <label for="task-description" id="description-label">Write your task description here.</label>
                    <input type="text" id="task-description" name="description" minlength="7" maxlength="85"
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
                            <option value="development">Development</option>
                            <option value="desing">Desing</option>
                            <option value="exercise">Exercise</option>
                            <option value="social">Social</option>
                            <option value="research">Research</option>
                            <option value="management">Management</option>
                            <option value="other...">Other...</option>
                        </select>
                        <p class="error-message" id="category-error">Select at least one category.</p>
                    </div>
                    <div class="form-column">
                        <label id="priority-label">Choose your task priority</label>
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
                            <label id="start-time-label">Start time</label>
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
                            <label id="end-time-label">End time</label>
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
                    Create Task <i class="bi bi-arrow-down-right"></i>
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
        </div>
    </section>
    <section class="third-section">
      
      <h3>Today's Report</h3>
        <div class="today-tasks-report">
          <div class="today-box">

          <div class="today-details">
            <span class="today-icon" id="done-icon">
             <i class="bi bi-patch-check-fill"></i>
            </span>
            <p>Completed <br> tasks</p>
          </div>

          <h3 id="done-tasks">30%</h3>
          </div>
          
          <div class="today-box">
            

            <div class="today-details">
            <span class="today-icon" id="time-icon">
            <i class="bi bi-watch"></i>
            </span>
            <p>Tracked <br> Time</p>
            </div>
            <h3 id="tasks-time">3h & 25m</h3>
          </div> 

          <div class="today-box">
            

            <div class="today-details">
            <span class="today-icon" id="lenght-icon">
            <i class="bi bi-database-fill"></i>
            </span>
            <p>Created <br> Tasks</p>
            </div>
            <h3 id="lenght-tasks">3 tasks</h3>
          </div> 
        </div>
        
    </section>
</div>
    `;
}

export function addTaskToHtml(tasks) {
  const list = document.getElementById("task-list-div");
  if (list)
    list.innerHTML =
      tasks.length === 0
        ? `<div class="no-data-img"><img src="../src/assets/empty-box.png" style="width: 35%;" alt=""></div>`
        : tasks.map(taskToHTML).join("");
}

function taskToHTML(task) {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="done-icon-svg"
          data-id="${task.id}"
        >
          <PATh d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        </svg>
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
            class="ri-edit-circle-fill task-edit-icon"
            data-id="${task.id}"
          ></i>
        </div>

        <div class="delete-icon-div" title="delete task">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="delete-icon-svg"
            data-id="${task.id}"
          >
            <PATh d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
      </div>
    </div>
  </li>`;
}

// Update task count
export function updateTaskCount(allCount, visibleCount) {
  // const allTaskLenght = document.getElementById("all_task");
  const filterTaskLenght = document.getElementById("length");

  // allTaskLenght.textContent = allCount;
  if (filterTaskLenght) filterTaskLenght.textContent = visibleCount;
}

// Adding angle brackets in filter
export function addAngleBracket(option, optionValue, nameVlue) {
  for (let i = 0; i < option.length; i++) {
    option[i].dataset.value === nameVlue
      ? (option[i].innerHTML =
          "<span style='color: #8ce5f4'> > </span>" + optionValue)
      : (option[i].textContent = option[i].dataset.value);
  }
}

export function addToDetailsCard(tasks) {
  const parentCardEl = document.getElementById("details_cards");
  if (parentCardEl) {
    parentCardEl.innerHTML = "";
    if (tasks.length !== 0) {
      tasks.forEach((task) => {
        parentCardEl.innerHTML += `
  
       <div class="details-card" style="background-color: ${
         task.priority.color
       };">
          <div class="task-details">
            <div class="task-title">
              <h3 id="task-desc">${
                task.description.length > 15
                  ? task.description.slice(0, 15) + "..."
                  : task.description
              }</h3>
              <span id="category">${task.category}</span>
            </div>
            <div class="priority-icon">
              <img src="${task.priority.icon}" alt="">
            </div>
          </div>
          <div class="task-time">
            <div class="task-start-time">
              <h3 class="start-time">
              ${
                new Date(task.startTime).getHours() === 0
                  ? 12
                  : new Date(task.startTime).getHours() > 12
                  ? Math.abs(new Date(task.startTime).getHours() - 12)
                  : new Date(task.startTime).getHours()
              }: 
              ${new Date(task.startTime)
                .getMinutes()
                .toString()
                .padStart(2, "0")} 
              ${new Date(task.startTime).getHours() >= 12 ? "PM" : "AM"}</h3>
              <p>Start</p>
            </div>
            <div class="task-done-time"><span>${
              task.durationMinutes + "m"
            }</span></div>
            <div class="task-end-time">
              <h3 class="end-time">${
                new Date(task.endTime).getHours() === 0
                  ? 12
                  : new Date(task.endTime).getHours() > 12
                  ? Math.abs(new Date(task.endTime).getHours() - 12)
                  : new Date(task.endTime).getHours()
              }: 
              ${new Date(task.endTime)
                .getMinutes()
                .toString()
                .padStart(2, "0")} 
              ${new Date(task.endTime).getHours() >= 12 ? "PM" : "AM"}</h3>
              <p>End</p>
            </div>
          </div>
        </div> 
       `;

        parentCardEl.style.gridTemplateColumns = `repeat(${
          tasks.length + 1
        }, 1fr)`;
      });
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
}
