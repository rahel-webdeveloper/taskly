const SidebarMenu = () => {
  return `
    <ul class="sidebar-links">
      <li>
        <a href="/" data-navigo>
          <i class="bi bi-snow"></i> <span>Task Hub</span>
        </a>
      </li>

      <li>
        <a href="/ai-advisor" id="ai_advice-link" data-navigo>
          <i class="bi bi-stars"></i> <span>AI Advisor</span>
        </a>
      </li>

      <li>
        <a href="/dashboard" data-navigo>
          <i class="bi bi-pie-chart-fill"></i> <span>Dashboard</span>
        </a>
      </li>

      <li>
        <a href="/timer" data-navigo>
          <i class="bi bi-stopwatch-fill"></i> <span>Timer</span>
        </a>
      </li>
    </ul>
  `;
};

export default SidebarMenu;
