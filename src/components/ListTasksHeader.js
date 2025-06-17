const ListTasksHeader = () => {
  return `
  <div class="list-tasks-header">
    <div class="custom-select" id="custom_select">
      <div class="selected-option" id="selected_option">
        <p class="state-name" data-value="all">
          Filter Tasks
        </p>
        <svg
          class="filter-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
        </svg>
      </div>
      <div class="filter-list" id="filter_list">
        <span class="option" data-value="all">
          
          > all
        </span>
        <span class="option" data-value="done">
          done
        </span>
        <span class="option" data-value="in-progress">
          in-rogress
        </span>
        <span class="option" data-value="on-hold">
          on-hold
        </span>
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
