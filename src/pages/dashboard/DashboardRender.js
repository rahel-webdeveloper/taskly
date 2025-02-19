const DashboardRender = () => {
  return `
  <div class="dashboard">
    <div class="dash-header">
      <h2>Hi, My friend!</h2>
      <h5>Let's take a look to your workout</h5>
    </div>
    <div class="dashboard-charts">

      <div class="category-chart chart">
        <p>Your categories</p>
        <canvas id="category_bar"></canvas>
      </div>

      <div class="seven-days-chart chart">
        <p>Last seven days workout</p>
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
