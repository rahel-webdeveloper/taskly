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
          <span>1</span>
          <span>2</span>
          <span>3</span>
         </div>
        </div>
        <canvas id="state_doughnut"></canvas>
      </div>
    </div>
  </div>`;
};
export default DashboardRender;
