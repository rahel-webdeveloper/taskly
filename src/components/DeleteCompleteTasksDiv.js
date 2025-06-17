const DeleteCompleteTasksDiv = () => {
  return `
    <div class="all-delete-div" id = "delete_all_tasks" >
      <span title="Delete all your done tasks tasks!" class="all-delete-btn"><img
        src="https://www.svgrepo.com/show/529256/trash-bin-minimalistic.svg" class="all-delte-icon"></span>
            
  <div class="delete-ask-div">
    <span id="exclamation-icon"><i class="bi bi-exclamation-circle-fill"></i></span>
    <h3>Delete tasks</h3>
    <p class="ask-div-header">Are sure you want to delete all your done tasks? <br> it will never return back.</p>
    <div class="ask-btns">
      <button id="no" class="ask-btn">No</button>
      <button id="yes" class="ask-btn">Yes</button>
    </div>
  </div>
`;
};

export default DeleteCompleteTasksDiv;
