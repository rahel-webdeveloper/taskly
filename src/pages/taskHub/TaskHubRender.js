import sendFeedbackComponent from "../../components/SendFeedback";
import TodaysReportDiv from "../../components/Today'sReportDiv";
import { priorityColors, priorityIcons } from "../../data/ui-data";
import renderTasksList from "../../tasks/tasksRender";
import { cacheTaskHubEls } from "./store";
import taskHubLogic, {
  formatCardDate,
  formatDuration,
  getRelativeDayLabel,
  getTaskHubElements,
  taskHub_EventsHandler,
} from "./TaskHubLogic";

// Const section main content
export default function TaskHubRender() {
  return `
  <div class="task__hub-page" id="task__hub-page">
  <section class="first-section">
  ${TaskForm()}
    <div class="top-of-card">
        <label for="task-title" title="Add new task" id="add-task-icon"><i class="bi bi-plus"></i></label>
        <a id="scroll-end-icon" title="Scroll left and right of cards" href="#last-card"><i class="bi bi-align-end"></i></a>
      </div>
      <div class="card-container">
        <div class="details-cards" id="details_cards">
          <!-- New task card will appear here -->
        </div>
      </div>
  </section>
  <section class="second-section"> 
      ${renderTasksList()}
  </section>
    <section class="third-section">
      ${TodaysReportDiv()}
    </section>
  </div>

  ${sendFeedbackComponent()}
    `;
}

TaskHubRender.init = function () {
  cacheTaskHubEls.set(getTaskHubElements());

  const { taskHubPage } = cacheTaskHubEls.get();
  taskHubPage.addEventListener("click", taskHub_EventsHandler);

  taskHubLogic();
};

const TaskForm = () => {
  return `
  <div id="add_task_form-dialog">
   <div class="form-container">
   <button id="close_form-dialog"><i class="bi bi-x"></i></button>
  <form action="" class="form" id="form">
    <div class="form-row">
      <div class="form-column">
        <label for="task-title" id="title-label">Title</label>
        <input type="text" id="task-title" name="title" minlength="3" maxlength="30"
        placeholder="Write your task title..." required></input>
        <p class="error-message" id="title-error">The title must be at least 3 characters.</p>
      </div>
      <div class="form-column">
        <label for="category" id="select-label">Category</label>
        <select id="category" name="category">
          <option value=""></option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Coding">Coding</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Exercise">Exercise</option>
          <option value="Social">Social</option>
          <option value="Research">Research</option>
          <option value="Management">Management</option>
          <option value="Content">Content</option>
          <option value="Other...">Other...</option>
        </select>
        <p class="error-message" id="category-error">Select at least one category.</p>
      </div> 
    </div>

    <div class="form-column" id="des_column">
      <label for="task-description" id="description-label">Description</label>
      <textarea id="task-description" name="description" rows="7" min="30" max="470"
        placeholder="Write your task description or let Taskly to generate for you." required></textarea>
        <div id="generating-des_loading-div">
        
        </div>
        <i class="ri-lightbulb-flash-fill" id="des_generator_icon" title="Generate description"></i>
      <p class="error-message" id="description-error">The description must be at least 9 characters.</p>
    </div>
    
    <div class="form-row">
      <div class="form-column" id="start-datetime_div">
        <label for="start_date-time" id="show-time-dev-label">Start Time</label>
        <div class="time-input">
          <label for="start_date-time" class="icon-label">
            <i class="ri-map-pin-time-fill"></i>
          </label>
          <input type="" id="start_date-time" class="" data-input name="startHour" title="Enter your task start time."
            placeholder="Enter your start datetime." required>
        </div>
      </div>
      <div class="form-column">
        <div class="slider_container">
           <label for="priority_slider" id="priority_slider-label">Task priority</label>
      
           <div class="task_priority">
            <i class="bi bi-star"></i>
            <span>Critical</span>
           </div>
           
          <input type="range" class="priority__slider" id="priority_slider" min="1" max="5" value="3">
           
        </div>
        <p class="error-message" id="priority-error-message">Your task must have a priority.</p>
      </div>
    </div>

    <div class="form-row">
      <div class="form-column" id="due-datetime_div">
        <label for="due_date-time" id="duration-label">Due Time</label>
        <div class="time-input">
          <label for="due_date-time" class="icon-label">
            <i class="ri-map-pin-time-fill"></i>
          </label>
          <input type="number" id="due_date-time" class="flatpickr-input" data-input name="due date & time"
            title="Enter your task due date & time." placeholder="Enter your due datetime." required>
        </div>
      </div>
      <p class="error-message" id="time-error">Please enter valid time.</p>

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
  </div>
  `;
};

export function addToDetailsCard(liveTasks) {
  const parentCardEl = document.getElementById("details_cards");

  if (parentCardEl) {
    parentCardEl.innerHTML = "";

    if (liveTasks.length !== 0) {
      liveTasks.forEach((task) => {
        parentCardEl.innerHTML += `

    <div class="details-card" style = "background-color: ${
      priorityColors[task.prioritylevel - 1]
    }; ">
  <div class="task-details">
            <div class="task-title">
              <h3 id="task-desc">${
                task.title.length > 15
                  ? task.title.slice(0, 15) + "..."
                  : task.title
              }</h3>
              <span id="category">${task.category}</span>
            </div>
            <div class="priority-icon">
              <i class="bi${" " + priorityIcons[task.prioritylevel - 1]}"></i>
            </div>
          </div>
  <div class="task-card-time-dev">
    <div class="task-datetime">
      <h3 class="show-time-dev">
        ${getRelativeDayLabel(task)}
        ${formatCardDate(task)}
      </h3>
      <p class="time-label">Start</p>
    </div>
    <div class="task-duration">
      <span id="duration-seconds" class="duration_seconds">
         00s
      </span>
      <p>duration</p>
      <h3 id="duration" class="duration">
        ${formatDuration(task.duration).days}
        ${formatDuration(task.duration).hours}
        ${formatDuration(task.duration).minutes}
      </h3>
    </div>
  </div>
 </div>
  `;
        // Card container Grid style
        parentCardEl.style.gridTemplateColumns = `repeat(${
          liveTasks.length + 1
        }, 1fr)`;
      });
    } else {
      parentCardEl.innerHTML = sampleOfCard();

      // Style base on overflow
      const emptyCard = document.querySelector(".empty-card");
      liveTasks.length === 0
        ? (emptyCard.style.margin = ".5rem")
        : (emptyCard.style.margin = "0rem");
    }
  }
}

const sampleOfCard = () => {
  return `
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
          <div class="task-card-time-dev">
            <div class="task-datetime">
              <h3 class="show-time-dev">0: 00 AM</h3>
              <p>Start</p>
            </div>
            <div class="task-duration">
            <p>duration</p>
            <h3 id="duration">0day 0h 00m <span id="duration-seconds">00s</span></h3>
            </div>
        </div>
    </div>
  `;
};
