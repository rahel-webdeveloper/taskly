const Profile = ({ data }) => {
  return `
    <button class="profile-avatar" id="profile-btn" popovertarget="profile-popover">
    ${data.name.slice(0, 1)}
    </button>

    <div id="profile-popover" popover>
     <div class="profile-header">
     <span class="profile-avatar"><i class="bi bi-person"></i></span>
  <h2 class="profile-name">${data.name}</h2>
 </div>
 <div class="profile-details">
  <p><i class="bi bi-envelope"></i> ${data.email}</p>
  <span>Emailaddress</span>
  <p><i class="bi bi-person"></i> ${data.name}</p>
  <span>Username</span>
</div>
<div class="profile-actions">
  <button id="settings-btn"><i class="bi bi-person-gear"></i><p>Settings</p></button>

  <button id="create-acount-btn"><i class="bi bi-person-plus"></i><a href="/auth/sign-up">Add account</a></button>
  
  <button id="logout-btn"><i class="bi bi-box-arrow-right"></i> <a href="/auth/sign-in">Logout</a></button>
</div>
    </div>
  `;
};

export default Profile;
