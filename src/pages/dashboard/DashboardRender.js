import sendFeedbackComponent from "../../components/SendFeedback.js";
import TodaysReportDiv from "../../components/Today'sReportDiv";
import renderTasksList from "../../tasks/tasksRender.js";
import { userData } from "../auth/store.js";
import DashboardLogic from "./DashboardLogic.js";

const DashboardRender = () => {
  return `
  <div class="dashboard">
    <div class="dash-header">
      <h2>Hi, ${!userData.get() ? "(User Name)" : userData.get()?.name}!</h2>
      <h5>Let's take a look to your workout</h5>
    </div>
    <div class="dashboard-charts">

      <div class="category-chart chart">
        <div class="chart-details">
          <div>
            <p>total category</p>
            <h1 id="ctegory-count">7</h1>
          </div>
          <p class="chart-title"> Categories bars <i class="bi bi-bar-chart-line-fill"></i></p>
          
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

      <div class="statechart-tracktime-div">
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
        <div class="state-div">
         <canvas id="tracked-time_bar"></canvas>
        </div>
        <div class="time-details">
          <h3>Tracked time: <span id="tracked-time">20h & 37m</span></h3>
          <h3>Remaining time: <span id="remaining-time">30h & 23m</span></h3>
        </div>
       </div>
      </div>

    
       <div class="dashboard_tasks-list">
        ${renderTasksList()}
       </div>
      
       ${TodaysReportDiv()}
       
      </div>
      
  </div>

  ${sendFeedbackComponent()}
  
  `;
};

DashboardRender.init = function () {
  DashboardLogic();
};

export default DashboardRender;
