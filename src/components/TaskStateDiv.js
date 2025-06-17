const TaskStateDiv = (state) => {
  return `
  <div class="state-of-task">
    <p id="${state}-task">
      <i class="bi ${
        (state === "done" && "bi-star-fill") ||
        (state === "in-progress" && "bi-circle-fill") ||
        (state === "on-hold" && "bi-triangle-fill")
      }"></i>
      ${
        (state === "done" && "Done") ||
        (state === "in-progress" && "In progress") ||
        (state === "on-hold" && "On hold")
      }
    </p>
  </div>
   `;
};

export default TaskStateDiv;
