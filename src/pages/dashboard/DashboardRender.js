const DashboardRender = () => {
  return `
  <div class="dashboard">
    <div class="dash-header">
      <h2>Hi, My friend!</h2>
      <h5>Let's take a look to your workout</h5>
    </div>
    <div class="dashboard-charts">
      <div class="category-chart chart">
        <div class="chart-details">
          <div>
            <p>total category</p>
            <h1 id="ctegory-count">7</h1>
          </div>
          <p class="chart-title"> Categories charts <i class="bi bi-bar-chart-line-fill"></i></p>
          
        </div>
        <canvas id="category_bar"></canvas>
      </div>

      <div class="seven-days-chart chart">
        <div class="chart-details">
          <div>
            <p>total tasks</p>
            <h1 id="seven-days-count">37</h1>
          </div>
          <p class="chart-title"> Last 7 days workout <i class="bi bi-activity"></i></p>
          
        </div>
        <canvas id="days_line"></canvas>
      </div>

      <div class="state-chart chart">
        <div class="state-details">
         <p class="chart-title">Tasks by state <i class="bi bi-lightning-charge"></i></p>

         <div class="state-span">
          <span>On hold</span>
          <span>In progress</span>
          <span>Done</span>
         </div>
        </div>
        <div id="doughnut-chart_div">
          <span id="done-task_percetage">0%</span>
          <canvas id="state_doughnut"></canvas>
        </div>
      </div>

      <div class="tracked-time-chart chart">
        <div class="chart-details">
          
          <p class="chart-title"> Time details <i class="bi bi-clock-history"></i></p>
          <div class="time-span">
          <span>Tracked time</span>
          <span>Remaining time</span>
         </div>
        </div>
        <canvas id="tracked-time_bar"></canvas>
        <div class="time-details">
          <h3>Tracked time: <span id="tracked-time">20h & 37m</span></h3>
          <h3>Remaining time: <span id="remaining-time">30h & 23m</span></h3>
        </div>
      </div>

      <div class="dashboard_tasks-list">
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
        </div>
      </div>
  </div>`;
};

export default DashboardRender;
