const TaskEditBox = () => {
  return `
    <div class="task-edit-box">
        <input type="text" id="task-edit-input" placeholder="Write your edited task description.">

            <div class="edit-result-btns">
                <button id="cancel" class="edit-answer-btn">Cancel</button>
                <button id="save" class="edit-answer-btn">Save</button>
            </div>
    </div>
    `;
};

export default TaskEditBox;
