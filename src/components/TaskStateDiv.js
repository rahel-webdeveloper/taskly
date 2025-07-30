const TaskStateDiv = (status) => {
  return `
  <div class="status-of-task">
    <p id="${status}-task">
      <i class="bi ${
        (status === "done" && "bi-star-fill") ||
        (status === "in-progress" && "bi-circle-fill") ||
        (status === "on-hold" && "bi-triangle-fill")
      }"></i>
      ${
        (status === "done" && "Done") ||
        (status === "in-progress" && "In progress") ||
        (status === "on-hold" && "On hold")
      }
    </p>
  </div>
   `;
};

export default TaskStateDiv;
