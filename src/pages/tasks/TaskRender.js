import TasksContainer, {
  renderTodayDiv,
} from "../../listTasks/ListTasksRender";

// Const section main content
export default function TasksHomePage() {
  return `
    <div class="tasks-home-page" id="tasks-home-page">
      <section class="first-section">
        <div class="form-container">
          <form action="" class="form" id="form">
            <div class="form-column">
              <label for="task-description" id="description-label">Write your task description here</label>
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
                <label id="priority-label">Choose a priority</label>
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
            <div class="form-row" id="datetime-input-div">
              <div class="form-column" id="start-datetime_div">

              <label for="start_date-time" id="start-time-label"><i class="bi bi-calendar2-week"></i> Start datetime</label>
              <div class="time-input" >
                  <input type="" id="start_date-time" class="" data-input name="startHour" title="Enter your task start time."
                    placeholder="Enter your start datetime." required>
                </div>
              </div>
              <div class="form-column" id="due-datetime_div">
               <label for="due_date-time" id="duration-label"><i class="ri-alarm-warning-line"></i> Due datetime</label>
                <div class="time-input">
                  <input type="number" id="due_date-time" class="flatpickr-input" data-input name="due date & time"
                    title="Enter your task due date & time." placeholder="Enter your due datetime." required>
                </div>
              </div>
              <p class="error-message" id="time-error">Please enter valid time.</p>

            </div>

            <div class="form-row">
              <div class="form-column">
                <label class="switch-time-allDay">
                  <input type="checkbox" name="startTimeCheckbox" id="checkbox">
                  <span class="checkmark">Time</span>
                  <span class="checkmark">All day</span>

                  </label>
              </div>
              
            </div>
            <button class="create-btn" type="submit" id="create_btn">
              Create Task <i class="bi bi-arrow-down-right"></i>
            </button>
          </form>
        </div>
      </section>
      <section class="second-section">
        <div class="top-of-card">
        <label for="task-description" title="Add new task" id="add-task-icon"><i class="bi bi-plus"></i></label>
        <a id="scroll-end-icon" title="Scroll left and right of cards" href="#last-card"><i class="bi bi-align-end"></i></a>
        </div>
        <div class="card-container">
          <div class="details-cards" id="details_cards">
            <!-- New task card will appear here -->
          </div>
        </div>
        ${TasksContainer()}
      </section>
      <section class="third-section">

        ${renderTodayDiv()}

      </section>
    </div>
    `;
}

export function addToDetailsCard(live_tasks) {
  const parentCardEl = document.getElementById("details_cards");

  if (parentCardEl) {
    parentCardEl.innerHTML = "";

    if (live_tasks.length !== 0) {
      live_tasks.forEach((task) => {
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
              <i class="bi${" " + task.priority.icon}"></i>
            </div>
          </div>
          <div class="task-time">
            <div class="task-start-time">
              <h3 class="start-time">
              ${
                new Date().toISOString().slice(0, 10) !==
                new Date(task.dueDateTime).toISOString().slice(0, 10)
                  ? new Date(task.dueDateTime).toISOString().slice(0, 10)
                  : "Today "
              }
              ${
                new Date(task.startDateTime).getHours() === 0
                  ? 12
                  : new Date(task.startDateTime).getHours() > 12
                  ? Math.abs(new Date(task.startDateTime).getHours() - 12)
                  : new Date(task.startDateTime).getHours()
              }: 
              ${new Date(task.startDateTime)
                .getMinutes()
                .toString()
                .padStart(2, "0")} 
              ${
                new Date(task.startDateTime).getHours() >= 12 ? "PM" : "AM"
              }</h3>
              <p class="start-label">Start</p>
            </div>

            
            <div class="task-duration">
            <p>duration</p>
            <h3 id="duration" class="duration">

            ${
              Math.floor(task.durationMinutes / 60 / 24) > 1
                ? Math.floor(task.durationMinutes / 60 / 24) + "days"
                : Math.floor(task.durationMinutes / 60 / 24) + "day"
            }

            ${Math.floor((task.durationMinutes / 60) % 24) || 0}h 

            ${(task.durationMinutes % 60)
              .toString()
              .padStart(2, "0")}m <span id="duration-seconds">

            ${((task.durationMinutes * 60) % 60)
              .toString()
              .padStart(2, "0")}s</span></h3>
            </div>
          </div>
        </div> 
       `;

        parentCardEl.style.gridTemplateColumns = `repeat(${
          live_tasks.length + 1
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
            <i class="bi bi-lightbuld-fill"></i>
            </div>
          </div>
          <div class="task-time">
            <div class="task-start-time">
              <h3 class="start-time">0: 00 AM</h3>
              <p>Start</p>
            </div>
            <div class="task-duration">
            <p>duration</p>
            <h3 id="duration">0day 0h 00m <span id="duration-seconds">00s</span></h3>
            </div>
          </div>
        </div>
      `;

      // Style base on overflow
      const emptyCard = document.querySelector(".empty-card");
      live_tasks.length === 0
        ? (emptyCard.style.margin = ".5rem")
        : (emptyCard.style.margin = "0rem");
    }
  }
}
