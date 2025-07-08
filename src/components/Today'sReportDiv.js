const TodaysReportDiv = () => {
  return `
        <div class="today-report-div"> 
        <h3 class="today-div-header">Today's Report</h3>
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
                  <h3><span id="lenght-tasks"></span> tasks</h3>
                </div> 
              </div>
          </div>
        `;
};

export default TodaysReportDiv;
