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
          <h1 id=ctegory-count">7</h1>
          <div>
          <p> top: development</p>
          <p>total categories</p>
          </div>

          </div>
          <i class="bi bi-lightning-charge"></i>
        </div>
        <canvas id="category_bar"></canvas>
      </div>

      <div class="seven-days-chart chart">
      <div class="chart-details">
          <div>
          
          <h1 id=ctegory-count">37</h1>
          <div>
          <p>Last 7 days workout</p>
          <p>total tasks</p>
          </div>

          </div>
          <i class="bi bi-activity"></i>
        </div>
        <canvas id="days_line"></canvas>
      </div>

      <div class="state-chart chart">
        <p>Tasks by state</p>
        <div>
          <canvas id="state_doughnut"></canvas>
        </div>
      </div>
    </div>
  </div>`;
};
export default DashboardRender;
