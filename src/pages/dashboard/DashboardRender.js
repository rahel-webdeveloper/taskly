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
          <p class="chart-title"> Categories charts </p>
          <i class="bi bi-lightning-charge"></i>
        </div>
        <canvas id="category_bar"></canvas>
      </div>

      <div class="seven-days-chart chart">
        <div class="chart-details">
          <div>
            <p>total tasks</p>
            <h1 id="seven-days-count">37</h1>
          </div>
          <p class="chart-title">Last 7 days workout</p>
          <i class="bi bi-activity"></i>
        </div>
        <canvas id="days_line"></canvas>
      </div>

      <div class="state-chart chart">
        <div class="state-details">
         <h5> Tasks by state</h5>

         <div class="state-span">
          <span>On hold</span>
          <span>In progress</span>
          <span>Done</span>
         </div>
        </div>
        <div id="doughnut-chart_div">
          <span id="done-task_percetage">32%</span>
          <canvas id="state_doughnut"></canvas>
        </div>
      </div>

      <div class="tracked-time-bars chart">
        <div class="chart-details">
          
          <p class="chart-title"> Time details </p>
        </div>
        <canvas id="tracked-time_bar"></canvas>
        <div class="time-span">
          <span>On hold</span>
          <span>In progress</span>
         </div>
      </div>
    </div>
  </div>`;
};
export default DashboardRender;
