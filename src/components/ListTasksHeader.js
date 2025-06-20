const ListTasksHeader = () => {
  return `
  <div class="list-tasks-header">
    <div class="filter-sort_div">
      <div class="panel" id="panel_filter">
        <div class="panel--filter">
          <i class="filter-icon bi bi-funnel-fill"></i>
          <p class="panel__label">
            Filter
          </p>
        </div>
        <div class="panel__controls-div" id="panel__filter_controls">
          <span class="option" data-value="all"> <i class="bi bi-folder-fill"></i> <h5>All</h5>
          </span>
          <span class="option" data-value="done">
            <i class="bi bi-star-fill"></i>
            <h5>Done</h5>
          </span>
          <span class="option" data-value="in-progress">
          <i class="bi bi-circle-fill"></i>
            
            <h5>In Progress</h5>
          </span>
          <span class="option" data-value="on-hold">
          <i class="bi bi-triangle-fill"></i>
            <h5>On Hold</h5>
          </span>
        </div>
      </div>

      <div class="panel" id="panel_sort">
        <div class="panel--sort">
        <i class="sort-icon bi bi-filter"></i>
        <p>Sort</p>
        </div>

        <div class="panel__controls-div" id="panel__sort_controls">
          <span class="option" data-value="name"> <i class="bi bi-filter-circle-fill"></i> <h5>Name</h5>
          </span>
          <span class="option" data-value="date">
            <i class="bi bi-calendar-date-fill"></i>
            <h5>Date</h5>
          </span>
        </div>
      </div>

    </div>


    <div class="task-length">
      <h4>Your tasks </h4>
      <div class="length">
        <span id="length">0</span>
      </div>
    </div>
  </div>
  `;
};

export default ListTasksHeader;
