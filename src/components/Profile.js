const Profile = ({ data }) => {
  return `
    <button class="profile-avatar" id="profile-btn" popovertarget="profile-pop">
    </button>

    <div id="profile-pop" popover>
     <div class="profile-header">
     <span class="profile-avatar">${data.name.slice(0, 1)}</span>
  <h2 class="profile-name">${data.name}</h2>
 </div>
 <div class="profile-details">
  <p><i class="bi bi-envelope"></i> <span>Email:</span> ${data.email}</p>
  <p><i class="bi bi-person"></i> <span>Username:</span> ${data.name}</p>
</div>
<div class="profile-actions">
  <button id="settings-btn"><i class="bi bi-person-gear"></i><p>Settings</p></button>

  <button id="create-acount-btn"><i class="bi bi-person-plus"></i><a href="/auth/sign-up">Add account</a></button>
  
  <button id="logout-btn"><i class="bi bi-box-arrow-right"></i> <a href="/auth/sign-in" data-navigo>Logout</p></button>
</div>
    </div>
  `;
};

export default Profile;
