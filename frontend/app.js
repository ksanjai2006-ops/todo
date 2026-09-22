/* ============================================
   TODOIST REPLICA — Fullstack App Logic
   Decoupled Frontend Client with REST API & Offline Cache
   ============================================ */

// ── Color Palettes & Defaults ───────────────
const CATEGORY_COLORS = [
  '#DC4C3E', '#EB8909', '#FF9A14', '#E8A500',
  '#058527', '#299438', '#14AAF5', '#246FE0',
  '#692FC2', '#AF38EB', '#EB96EB', '#B8255F',
  '#FF8D85', '#808080', '#333333', '#6C7A21'
];

const DEFAULT_DATA = {
  users: [
    { id: 'user-1', name: 'Denise', email: 'denise@example.com' }
  ],
  categories: [
    { id: 'cat-1', name: 'Work', color: '#246FE0' },
    { id: 'cat-2', name: 'Personal', color: '#DC4C3E' },
    { id: 'cat-3', name: 'Health & Fitness', color: '#058527' },
    { id: 'cat-4', name: 'Shopping', color: '#FF9A14' },
    { id: 'cat-5', name: 'Learning', color: '#692FC2' }
  ],
  projects: [
    { id: 'proj-1', name: 'Fitness', color: '#058527', section: 'myProjects' },
    { id: 'proj-2', name: 'Groceries', color: '#FF9A14', section: 'myProjects' },
    { id: 'proj-3', name: 'Appointments', color: '#AF38EB', section: 'myProjects' },
    { id: 'proj-4', name: 'New Brand', color: '#EB8909', section: 'team' },
    { id: 'proj-5', name: 'Website Update', color: '#299438', section: 'team' },
    { id: 'proj-6', name: 'Product Roadmap', color: '#246FE0', section: 'team' },
    { id: 'proj-7', name: 'Meeting Agenda', color: '#6C7A21', section: 'team' }
  ],
  tasks: [
    { id: 't-1', text: 'Do 30 minutes of yoga 🧘', completed: false, time: '7:30 AM', recurring: true, alarm: true, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'today' },
    { id: 't-2', text: 'Dentist appointment', completed: false, time: '10:00 AM', calendarIcon: true, alarm: true, recurring: false, section: 'myProjects', projectId: 'proj-3', categoryId: 'cat-2', priority: 'default', date: 'today' },
    { id: 't-3', text: 'Buy bread 🍞', completed: false, time: '', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'today' },
    { id: 't-4', text: 'Plan user research sessions', completed: false, time: '2:00 PM', calendarIcon: true, calendarTag: true, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'blue', date: 'today' },
    { id: 't-5', text: "Provide feedback on Amy's design", completed: false, time: '', calendar: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'today' },
    { id: 't-6', text: 'All-hands meeting', completed: false, time: '', recurring: true, section: 'team', projectId: 'proj-7', categoryId: 'cat-1', priority: 'default', date: 'today' },
    { id: 't-7', text: 'Morning Run', completed: false, time: '07:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'tomorrow' },
    { id: 't-8', text: 'Go Grocery Shopping', completed: false, time: '09:00', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'tomorrow' },
    { id: 't-9', text: 'Reply to Emails', completed: false, time: '12:00', recurring: false, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'default', date: 'tomorrow' },
    { id: 't-10', text: 'Discuss Plan with Client', completed: false, time: '13:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'blue', date: 'tomorrow' },
    { id: 't-11', text: 'Shoot Video', completed: false, time: '08:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-12', text: 'Host Project Meeting', completed: false, time: '14:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-13', text: 'Finalize Promo Video', completed: false, time: '17:30', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'orange', date: 'upcoming' },
    { id: 't-14', text: 'Pick Up Package', completed: false, time: 'Mon', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'upcoming' },
    { id: 't-15', text: 'Organize Project Meeting', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-16', text: 'Complete Client Proposal', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'upcoming' },
    { id: 't-17', text: 'Read new design articles', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-5', priority: 'default', date: 'inbox' },
    { id: 't-18', text: 'Update portfolio website', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-2', priority: 'default', date: 'inbox' }
  ],
  currentView: 'today',
  version: 3,
  nextTaskId: 100,
  nextCategoryId: 100,
  nextProjectId: 100
};

// ── Application State ───────────────────────
let appData;
let currentUser = { id: 'user-1', name: 'Denise', email: 'denise@example.com' };
let isServerOnline = false;

// UI Modals state
let selectedColor = CATEGORY_COLORS[0];
let projectSelectedColor = CATEGORY_COLORS[0];
let editingCategoryId = null;
let editingTaskId = null;
let schedulingTaskId = null;
let scheduleSelectedDate = 'today';

// Mobile UI State
const mobileState = {
  activeTab: 'tasks',
  drawerOpen: false,
  bottomSheetOpen: false
};

// ── API Configuration & Client Layer ────────
const API_BASE = (window.location.port === '5000' || window.location.pathname.startsWith('/api'))
  ? '/api'
  : 'http://localhost:5000/api';

async function checkServerConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      setConnectionStatus(true);
      return true;
    }
  } catch (e) {
    // Offline or server not running
  }
  setConnectionStatus(false);
  return false;
}

function setConnectionStatus(online) {
  isServerOnline = online;
  const pill = $('connectionStatus');
  if (pill) {
    if (online) {
      pill.className = 'connection-status-pill online';
      pill.querySelector('.status-text').textContent = 'Server Online';
    } else {
      pill.className = 'connection-status-pill offline';
      pill.querySelector('.status-text').textContent = 'Offline (Local)';
    }
  }
}

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    setConnectionStatus(true);
    return await res.json();
  } catch (err) {
    setConnectionStatus(false);
    throw err;
  }
}

// ── Data Persistence ────────────────────────
async function loadData() {
  // Check localStorage first for immediate rendering
  try {
    const saved = localStorage.getItem('todoist_replica_data');
    if (saved) {
      appData = JSON.parse(saved);
    } else {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    const savedUser = localStorage.getItem('todoist_current_user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  } catch (e) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  // Then attempt to fetch latest from server
  try {
    const serverData = await apiFetch('/data');
    if (serverData && serverData.tasks) {
      appData = serverData;
      saveLocalData();
      renderAll();
    }
  } catch (e) {
    // Continue with local data
  }
}

function saveLocalData() {
  try {
    localStorage.setItem('todoist_replica_data', JSON.stringify(appData));
    localStorage.setItem('todoist_current_user', JSON.stringify(currentUser));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

function saveData() {
  saveLocalData();
  renderAll();
}

// ── Helpers ─────────────────────────────────
function $(id) { return document.getElementById(id); }
function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function uid(prefix) {
  return prefix + '-' + (++appData.nextTaskId);
}
function getCategoryById(id) {
  return appData.categories.find(c => c.id === id);
}
function getProjectById(id) {
  return appData.projects.find(p => p.id === id);
}
function getTaskCountForCategory(catId) {
  return appData.tasks.filter(t => t.categoryId === catId && !t.completed).length;
}

// Sound chime for notification trigger
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // AudioContext not allowed before user interaction
  }
}

function showToast(message) {
  const container = $('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ── Rendering Functions ─────────────────────

function renderAll() {
  updateUserUI();
  renderSidebarCategories();
  renderSidebarProjects();
  renderNavCounts();
  renderMainContent();
  renderNotifications();
  if (mobileState.drawerOpen) renderMobileDrawer();
  renderMobileBody();
}

function updateUserUI() {
  const nameEl = $('userNameLabel');
  const fallbackEl = $('userAvatarFallback');
  const dropName = $('dropdownUserName');
  const dropEmail = $('dropdownUserEmail');
  const drawerName = $('drawerUserName');
  const drawerEmail = $('drawerUserEmail');

  const displayName = currentUser?.name || 'Denise';
  const displayEmail = currentUser?.email || 'denise@example.com';
  const initial = displayName.charAt(0).toUpperCase();

  if (nameEl) nameEl.textContent = displayName;
  if (fallbackEl) fallbackEl.textContent = initial;
  if (dropName) dropName.textContent = displayName;
  if (dropEmail) dropEmail.textContent = displayEmail;
  if (drawerName) drawerName.textContent = displayName;
  if (drawerEmail) drawerEmail.textContent = displayEmail;
}

// Render dynamic projects in My Projects & Team
function renderSidebarProjects() {
  const myProjectsContainer = $('myProjectsItems');
  const teamContainer = $('teamItems');

  const myProjects = (appData.projects || []).filter(p => p.section === 'myProjects');
  const teamProjects = (appData.projects || []).filter(p => p.section === 'team');

  if (myProjectsContainer) {
    myProjectsContainer.innerHTML = myProjects.map(p => `
      <button class="nav-item project-item${appData.currentView === 'project-' + p.id ? ' active' : ''}" data-project="${p.id}">
        <span class="project-icon hash" style="color: ${p.color}">#</span>
        <span class="nav-label">${esc(p.name)}</span>
      </button>
    `).join('');

    myProjectsContainer.querySelectorAll('.project-item').forEach(btn => {
      btn.addEventListener('click', () => {
        switchView('project-' + btn.dataset.project);
      });
    });
  }

  if (teamContainer) {
    teamContainer.innerHTML = teamProjects.map(p => `
      <button class="nav-item project-item${appData.currentView === 'project-' + p.id ? ' active' : ''}" data-project="${p.id}">
        <span class="project-icon hash" style="color: ${p.color}">#</span>
        <span class="nav-label">${esc(p.name)}</span>
      </button>
    `).join('');

    teamContainer.querySelectorAll('.project-item').forEach(btn => {
      btn.addEventListener('click', () => {
        switchView('project-' + btn.dataset.project);
      });
    });
  }
}

// Sidebar categories
function renderSidebarCategories() {
  const container = $('categoriesItems');
  if (!container) return;
  container.innerHTML = appData.categories.map(cat => {
    const count = getTaskCountForCategory(cat.id);
    return `
      <button class="nav-item category-item${appData.currentView === 'category-' + cat.id ? ' active' : ''}" 
              data-category="${cat.id}">
        <span class="category-dot" style="background: ${cat.color}"></span>
        <span class="nav-label">${esc(cat.name)}</span>
        <span class="nav-count">${count}</span>
      </button>`;
  }).join('');

  container.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchView('category-' + btn.dataset.category);
    });
    btn.addEventListener('contextmenu', (e) => {
      showCategoryContextMenu(e, btn.dataset.category);
    });
  });
}

function renderNavCounts() {
  const inboxC = $('inboxCount');
  const todayC = $('todayCount');
  const upcomingC = $('upcomingCount');
  if (inboxC) inboxC.textContent = appData.tasks.filter(t => t.date === 'inbox' && !t.completed).length;
  if (todayC) todayC.textContent = appData.tasks.filter(t => t.date === 'today' && !t.completed).length;
  if (upcomingC) upcomingC.textContent = appData.tasks.filter(t => (t.date === 'tomorrow' || t.date === 'upcoming') && !t.completed).length;
}

// Notification popover rendering
function renderNotifications() {
  const badge = $('notifBadge');
  const list = $('notifList');
  if (!list) return;

  const dueTasks = appData.tasks.filter(t => !t.completed && (t.alarm || t.time || t.date === 'today'));
  if (badge) {
    badge.textContent = dueTasks.length;
    badge.style.display = dueTasks.length > 0 ? 'flex' : 'none';
  }

  if (dueTasks.length === 0) {
    list.innerHTML = `<div class="notif-empty">🎉 All caught up! No active alarms or due tasks.</div>`;
    return;
  }

  list.innerHTML = dueTasks.map(t => `
    <div class="notif-item" data-task-id="${t.id}">
      <div class="notif-item-icon">${t.alarm ? '⏰' : '🔔'}</div>
      <div class="notif-item-content">
        <div class="notif-item-title">${esc(t.text)}</div>
        <div class="notif-item-desc">${t.time ? `Scheduled at ${t.time}` : 'Due Today'} · ${t.section === 'team' ? 'Team' : 'My Projects'}</div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      $('notifDropdown').classList.remove('open');
      const taskId = item.dataset.taskId;
      openEditTaskModal(taskId);
    });
  });
}

// ── Main Content View Rendering ─────────────
function renderMainContent() {
  const view = appData.currentView;
  const container = $('contentBody');
  const viewTitle = $('viewTitle');
  if (!container || !viewTitle) return;

  if (view === 'today') {
    viewTitle.textContent = 'Today';
    renderTodayView(container);
  } else if (view === 'inbox') {
    viewTitle.textContent = 'Inbox';
    renderInboxView(container);
  } else if (view === 'upcoming') {
    viewTitle.textContent = 'Upcoming';
    renderUpcomingView(container);
  } else if (view === 'filters') {
    viewTitle.textContent = 'Filters & Labels';
    renderFiltersView(container);
  } else if (view.startsWith('category-')) {
    const catId = view.replace('category-', '');
    const cat = getCategoryById(catId);
    if (cat) {
      viewTitle.innerHTML = `<span class="category-view-header"><span class="category-view-dot" style="background:${cat.color}"></span> ${esc(cat.name)}</span>`;
      renderCategoryView(container, catId);
    }
  } else if (view.startsWith('project-')) {
    const projId = view.replace('project-', '');
    const proj = getProjectById(projId);
    if (proj) {
      viewTitle.innerHTML = `<span style="color:${proj.color}; margin-right:6px;">#</span> ${esc(proj.name)}`;
      renderProjectView(container, projId);
    }
  }
}

function renderTodayView(container) {
  const todayTasks = appData.tasks.filter(t => t.date === 'today' && !t.completed);
  const myProjectTasks = todayTasks.filter(t => t.section === 'myProjects');
  const teamTasks = todayTasks.filter(t => t.section === 'team');

  let html = '';
  html += `
    <div class="task-section">
      <div class="content-section-title">My Projects</div>
      <div class="task-list" data-section="myProjects" data-date="today">
        ${myProjectTasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline('myProjects', 'today')}
    </div>`;

  html += `
    <div class="task-section">
      <div class="content-section-title">Team</div>
      <div class="task-list" data-section="team" data-date="today">
        ${teamTasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline('team', 'today')}
    </div>`;

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderInboxView(container) {
  const inboxTasks = appData.tasks.filter(t => t.date === 'inbox' && !t.completed);
  let html = `
    <div class="task-section">
      <div class="task-list" data-section="myProjects" data-date="inbox">
        ${inboxTasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline('myProjects', 'inbox')}
    </div>`;
  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderUpcomingView(container) {
  const tomorrowTasks = appData.tasks.filter(t => t.date === 'tomorrow' && !t.completed);
  const upcomingTasks = appData.tasks.filter(t => t.date === 'upcoming' && !t.completed);

  let html = '';
  html += renderTaskSection('Tomorrow', tomorrowTasks, 'myProjects', 'tomorrow');
  html += renderTaskSection('Next 7 Days', upcomingTasks, 'myProjects', 'upcoming');

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderProjectView(container, projId) {
  const proj = getProjectById(projId);
  const tasks = appData.tasks.filter(t => t.projectId === projId && !t.completed);
  let html = `
    <div class="task-section">
      <div class="task-list" data-section="${proj.section}" data-date="today">
        ${tasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline(proj.section, 'today', '', projId)}
    </div>`;
  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderCategoryView(container, catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;
  const catTasks = appData.tasks.filter(t => t.categoryId === catId && !t.completed);
  const todayTasks = catTasks.filter(t => t.date === 'today');
  const tomorrowTasks = catTasks.filter(t => t.date === 'tomorrow');
  const upcomingTasks = catTasks.filter(t => t.date === 'upcoming');

  let html = '';
  html += renderTaskSection('Today', todayTasks, 'myProjects', 'today', catId);
  html += renderTaskSection('Tomorrow', tomorrowTasks, 'myProjects', 'tomorrow', catId);
  html += renderTaskSection('Next 7 Days', upcomingTasks, 'myProjects', 'upcoming', catId);

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderFiltersView(container) {
  container.innerHTML = `
    <div class="task-section">
      <div class="content-section-title">Priority Filters</div>
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <span class="sheet-chip" style="color:#DC4C3E; border-color:#DC4C3E;">High Priority</span>
        <span class="sheet-chip" style="color:#FF9A14; border-color:#FF9A14;">Medium Priority</span>
        <span class="sheet-chip" style="color:#246FE0; border-color:#246FE0;">Low Priority</span>
      </div>
      <div class="task-list">
        ${appData.tasks.filter(t => !t.completed).map(t => renderTaskItem(t)).join('')}
      </div>
    </div>`;
  attachTaskListeners(container);
}

function renderTaskSection(title, tasks, section, date, catId = '') {
  return `
    <div class="task-section">
      <div class="content-section-title">${title} <span class="task-count-pill">${tasks.length}</span></div>
      <div class="task-list" data-section="${section}" data-date="${date}">
        ${tasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline(section, date, catId)}
    </div>`;
}

// Render individual task item with drag handle, time pill, schedule & edit buttons
function renderTaskItem(task) {
  const cat = getCategoryById(task.categoryId);
  const proj = getProjectById(task.projectId);
  const priorityClass = task.priority && task.priority !== 'default' ? 'priority-' + task.priority : '';

  let metaHtml = '';

  // Task time pill
  if (task.time) {
    metaHtml += `
      <span class="task-meta-item" title="Scheduled time">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="margin-right:3px;">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
          <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>${esc(task.time)}</span>
        ${task.alarm ? ' ⏰' : ''}
      </span>`;
  }

  if (proj) {
    metaHtml += `
      <span class="task-meta-item" style="color: ${proj.color}" title="Project">
        #${esc(proj.name)}
      </span>`;
  }

  if (cat) {
    metaHtml += `
      <span class="task-category-pill" onclick="event.stopPropagation(); switchView('category-${cat.id}')" title="Category">
        <span class="cat-dot" style="background: ${cat.color}"></span>
        ${esc(cat.name)}
      </span>`;
  }

  return `
    <div class="task-item${task.completed ? ' completed' : ''}" data-task-id="${task.id}" draggable="true" title="Drag to reorder ('hand task')">
      <div class="task-checkbox ${priorityClass}${task.completed ? ' checked' : ''}" data-task-id="${task.id}">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="task-content">
        <div class="task-text">${esc(task.text)}</div>
        ${metaHtml ? `<div class="task-meta">${metaHtml}</div>` : ''}
      </div>
      <div class="task-actions">
        <!-- Edit task button -->
        <button class="task-action-btn" title="Edit task details & time" data-action="edit" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Schedule date & time button -->
        <button class="task-action-btn" title="Schedule date & time" data-action="schedule" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <!-- Delete task button -->
        <button class="task-action-btn delete" title="Delete" data-action="delete" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>`;
}

// Inline Add Task Form with Time Picker
function renderAddTaskInline(defaultSection, defaultDate, defaultCategoryId = '', defaultProjectId = '') {
  const formId = 'addForm-' + defaultSection + '-' + defaultDate + '-' + (defaultCategoryId || 'all') + '-' + (defaultProjectId || 'all');
  return `
    <button class="add-task-inline" data-form="${formId}">
      <div class="add-task-inline-icon">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <span>Add task</span>
    </button>
    <div class="add-task-form" id="${formId}">
      <input class="add-task-form-input" type="text" placeholder="Task name" data-form-id="${formId}">
      <textarea class="add-task-form-desc" placeholder="Description" rows="1" data-form-id="${formId}"></textarea>
      
      <div class="add-task-form-toolbar">
        <!-- Category Dropdown -->
        <div class="category-select-wrapper">
          <button class="toolbar-btn" data-action="selectCategory" data-form-id="${formId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="7" cy="7" r="1" fill="currentColor"/>
            </svg>
            <span class="toolbar-btn-label" data-role="categoryLabel">${defaultCategoryId ? esc(getCategoryById(defaultCategoryId)?.name || 'Category') : 'Category'}</span>
          </button>
          <div class="category-select-dropdown" data-form-id="${formId}">
            <button class="category-option" data-cat-id="">No category</button>
            ${appData.categories.map(c => `
              <button class="category-option${defaultCategoryId === c.id ? ' selected' : ''}" data-cat-id="${c.id}">
                <span class="category-dot" style="background: ${c.color}"></span>
                ${esc(c.name)}
              </button>`).join('')}
          </div>
        </div>

        <!-- Time Picker (Add time in my task) -->
        <input type="time" class="add-task-time-input" data-role="taskTime" title="Add time to task">

        <!-- Priority Dropdown -->
        <div class="category-select-wrapper">
          <button class="toolbar-btn" data-action="selectPriority" data-form-id="${formId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span data-role="priorityLabel">Priority</span>
          </button>
          <div class="priority-select-dropdown" data-form-id="${formId}">
            <button class="priority-option" data-priority="default"><span class="priority-circle-sm" style="border-color:#C4C4C4"></span> Default</button>
            <button class="priority-option" data-priority="blue"><span class="priority-circle-sm" style="border-color:#246FE0"></span> Low</button>
            <button class="priority-option" data-priority="orange"><span class="priority-circle-sm" style="border-color:#FF9A14"></span> Medium</button>
            <button class="priority-option" data-priority="red"><span class="priority-circle-sm" style="border-color:#DC4C3E"></span> High</button>
          </div>
        </div>
      </div>

      <div class="add-task-form-actions">
        <div class="form-actions-left"></div>
        <div class="form-actions-right">
          <button class="btn-cancel" data-action="cancelForm" data-form-id="${formId}">Cancel</button>
          <button class="btn-submit" data-action="submitForm" data-form-id="${formId}" 
                  data-section="${defaultSection}" data-date="${defaultDate}" 
                  data-default-cat="${defaultCategoryId}" data-default-proj="${defaultProjectId}" disabled>Add task</button>
        </div>
      </div>
    </div>`;
}

// ── Event Binding for Task Lists & Drag-and-Drop ─────
function attachTaskListeners(container) {
  // Checkbox clicks
  container.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = cb.dataset.taskId;
      toggleTaskComplete(taskId, cb.closest('.task-item'));
    });
  });

  // Task Action Buttons (Edit, Schedule, Delete)
  container.querySelectorAll('.task-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const taskId = btn.dataset.taskId;
      if (action === 'delete') {
        deleteTask(taskId);
      } else if (action === 'edit') {
        openEditTaskModal(taskId);
      } else if (action === 'schedule') {
        openScheduleModal(taskId);
      }
    });
  });

  // Drag and Drop ("hand task")
  let draggedEl = null;
  container.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.taskId);
    });

    item.addEventListener('dragend', () => {
      if (draggedEl) draggedEl.classList.remove('dragging');
      container.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
      draggedEl = null;
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      item.classList.add('drag-over');
    });

    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const fromId = e.dataTransfer.getData('text/plain');
      const toId = item.dataset.taskId;
      if (fromId && toId && fromId !== toId) {
        reorderTasks(fromId, toId);
      }
    });
  });

  // Inline form trigger buttons
  container.querySelectorAll('.add-task-inline').forEach(btn => {
    btn.addEventListener('click', () => {
      openInlineForm(btn.dataset.form, btn);
    });
  });

  container.querySelectorAll('[data-action="cancelForm"]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeInlineForm(btn.dataset.formId);
    });
  });

  container.querySelectorAll('[data-action="submitForm"]').forEach(btn => {
    btn.addEventListener('click', () => {
      submitInlineForm(btn);
    });
  });

  // Input validation
  container.querySelectorAll('.add-task-form-input').forEach(input => {
    input.addEventListener('input', () => {
      const form = input.closest('.add-task-form');
      const submitBtn = form.querySelector('[data-action="submitForm"]');
      if (submitBtn) submitBtn.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const form = input.closest('.add-task-form');
        const submitBtn = form.querySelector('[data-action="submitForm"]');
        if (submitBtn && !submitBtn.disabled) submitInlineForm(submitBtn);
      }
    });
  });

  // Dropdown toggles inside inline form
  container.querySelectorAll('[data-action="selectCategory"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = btn.nextElementSibling;
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        if (d !== dd) d.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });

  container.querySelectorAll('.category-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = opt.closest('.category-select-wrapper');
      const btn = wrapper.querySelector('[data-action="selectCategory"]');
      const label = btn.querySelector('[data-role="categoryLabel"]');
      const catId = opt.dataset.catId;
      wrapper.dataset.selectedCategory = catId;
      const cat = getCategoryById(catId);
      label.textContent = cat ? cat.name : 'Category';
      opt.closest('.category-select-dropdown').classList.remove('open');
    });
  });

  container.querySelectorAll('[data-action="selectPriority"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = btn.nextElementSibling;
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        if (d !== dd) d.classList.remove('open');
      });
      dd.classList.toggle('open');
    });
  });

  container.querySelectorAll('.priority-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = opt.closest('.category-select-wrapper');
      const btn = wrapper.querySelector('[data-action="selectPriority"]');
      const label = btn.querySelector('[data-role="priorityLabel"]');
      const pri = opt.dataset.priority;
      wrapper.dataset.selectedPriority = pri;
      label.textContent = pri.charAt(0).toUpperCase() + pri.slice(1);
      opt.closest('.priority-select-dropdown').classList.remove('open');
    });
  });
}

function reorderTasks(fromId, toId) {
  const fromIndex = appData.tasks.findIndex(t => t.id === fromId);
  const toIndex = appData.tasks.findIndex(t => t.id === toId);
  if (fromIndex === -1 || toIndex === -1) return;

  const [moved] = appData.tasks.splice(fromIndex, 1);
  appData.tasks.splice(toIndex, 0, moved);
  saveData();

  // Async sync to server
  apiFetch('/tasks/reorder/list', {
    method: 'PUT',
    body: JSON.stringify({ taskIds: appData.tasks.map(t => t.id) })
  }).catch(() => {});
  showToast('✋ Task rearranged');
}

// ── Task Actions & CRUD ─────────────────────

function toggleTaskComplete(taskId, taskEl) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveData();

  // Async API sync
  apiFetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ completed: task.completed })
  }).catch(() => {});

  if (task.completed && taskEl) {
    taskEl.classList.add('completing');
    setTimeout(() => renderAll(), 350);
  } else {
    renderAll();
  }
}

function deleteTask(taskId) {
  appData.tasks = appData.tasks.filter(t => t.id !== taskId);
  saveData();
  apiFetch(`/tasks/${taskId}`, { method: 'DELETE' }).catch(() => {});
  showToast('🗑️ Task deleted');
}

function submitInlineForm(submitBtn) {
  const formId = submitBtn.dataset.formId;
  const form = $(formId);
  if (!form) return;

  const input = form.querySelector('.add-task-form-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const timeInput = form.querySelector('[data-role="taskTime"]');
  const taskTime = timeInput ? timeInput.value : '';

  const section = submitBtn.dataset.section || 'myProjects';
  const date = submitBtn.dataset.date || 'today';
  const defaultCat = submitBtn.dataset.defaultCat || '';
  const defaultProj = submitBtn.dataset.defaultProj || '';

  const catWrapper = form.querySelector('[data-action="selectCategory"]')?.closest('.category-select-wrapper');
  const selectedCat = catWrapper?.dataset.selectedCategory !== undefined ? catWrapper.dataset.selectedCategory : defaultCat;

  const priWrapper = form.querySelector('[data-action="selectPriority"]')?.closest('.category-select-wrapper');
  const selectedPriority = priWrapper?.dataset.selectedPriority || 'default';

  const newTask = {
    id: uid('t'),
    text: text,
    completed: false,
    time: formatTimeForDisplay(taskTime),
    recurring: false,
    alarm: !!taskTime,
    calendar: false,
    section: section,
    projectId: defaultProj,
    categoryId: selectedCat,
    priority: selectedPriority,
    date: date
  };

  appData.tasks.push(newTask);
  saveData();

  // Server sync
  apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(newTask)
  }).catch(() => {});

  showToast('✅ Task created');
}

function formatTimeForDisplay(timeStr) {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const [h, m] = timeStr.split(':');
  if (!h || !m) return timeStr;
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function openInlineForm(formId, triggerBtn) {
  document.querySelectorAll('.add-task-form.open').forEach(f => f.classList.remove('open'));
  document.querySelectorAll('.add-task-inline').forEach(b => b.style.display = '');

  const form = $(formId);
  if (form) {
    form.classList.add('open');
    triggerBtn.style.display = 'none';
    const input = form.querySelector('.add-task-form-input');
    if (input) {
      input.focus();
      input.value = '';
    }
  }
}

function closeInlineForm(formId) {
  const form = $(formId);
  if (form) {
    form.classList.remove('open');
    const triggerBtn = form.previousElementSibling;
    if (triggerBtn) triggerBtn.style.display = '';
  }
}

// ── Modals: Edit Task Modal ─────────────────

function openEditTaskModal(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;
  editingTaskId = taskId;

  $('editTaskTextInput').value = task.text;
  $('editTaskTimeInput').value = convertTo24Hour(task.time);
  $('editTaskDateSelect').value = task.date || 'today';
  $('editTaskPrioritySelect').value = task.priority || 'default';
  $('editTaskSectionSelect').value = task.section || 'myProjects';

  // Category select options
  const catSelect = $('editTaskCategorySelect');
  catSelect.innerHTML = `<option value="">No category</option>` + appData.categories.map(c => `
    <option value="${c.id}"${task.categoryId === c.id ? ' selected' : ''}>@ ${esc(c.name)}</option>
  `).join('');

  $('editTaskModal').classList.add('open');
  setTimeout(() => $('editTaskTextInput').focus(), 100);
}

function convertTo24Hour(timeStr) {
  if (!timeStr) return '';
  if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
    return timeStr.padStart(5, '0');
  }
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}`;
}

function closeEditTaskModal() {
  $('editTaskModal').classList.remove('open');
  editingTaskId = null;
}

function saveEditTask() {
  if (!editingTaskId) return;
  const task = appData.tasks.find(t => t.id === editingTaskId);
  if (!task) return;

  const newText = $('editTaskTextInput').value.trim();
  if (!newText) return;

  task.text = newText;
  task.time = formatTimeForDisplay($('editTaskTimeInput').value);
  task.date = $('editTaskDateSelect').value;
  task.priority = $('editTaskPrioritySelect').value;
  task.section = $('editTaskSectionSelect').value;
  task.categoryId = $('editTaskCategorySelect').value;
  task.alarm = !!task.time;

  saveData();
  apiFetch(`/tasks/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  }).catch(() => {});

  closeEditTaskModal();
  showToast('💾 Task updated');
}

// ── Modals: Schedule Task Modal ─────────────

function openScheduleModal(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;
  schedulingTaskId = taskId;
  scheduleSelectedDate = task.date || 'today';

  document.querySelectorAll('.schedule-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scheduleDate === scheduleSelectedDate);
  });
  $('scheduleTimeInput').value = convertTo24Hour(task.time);

  $('scheduleModal').classList.add('open');
}

function closeScheduleModal() {
  $('scheduleModal').classList.remove('open');
  schedulingTaskId = null;
}

function applySchedule() {
  if (!schedulingTaskId) return;
  const task = appData.tasks.find(t => t.id === schedulingTaskId);
  if (!task) return;

  task.date = scheduleSelectedDate;
  task.time = formatTimeForDisplay($('scheduleTimeInput').value);
  task.alarm = !!task.time;

  saveData();
  apiFetch(`/tasks/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify({ date: task.date, time: task.time, alarm: task.alarm })
  }).catch(() => {});

  closeScheduleModal();
  showToast(`📅 Task scheduled for ${task.date} ${task.time}`);
}

// ── Project Management (My Projects & Team `+`) ────────

function openAddProjectModal(defaultSection = 'myProjects') {
  projectSelectedColor = CATEGORY_COLORS[0];
  $('projectNameInput').value = '';
  $('projectSectionSelect').value = defaultSection;
  $('saveProjectBtn').disabled = true;

  $('addProjectModalTitle').textContent = defaultSection === 'team' ? 'Add Team Project' : 'Add My Project';

  renderColorPicker('projectColorPickerGrid', projectSelectedColor, (color) => {
    projectSelectedColor = color;
  });

  $('addProjectModal').classList.add('open');
  setTimeout(() => $('projectNameInput').focus(), 100);
}

function closeAddProjectModal() {
  $('addProjectModal').classList.remove('open');
}

function saveNewProject() {
  const name = $('projectNameInput').value.trim();
  if (!name) return;
  const section = $('projectSectionSelect').value || 'myProjects';

  const newProj = {
    id: 'proj-' + (++appData.nextProjectId),
    name: name,
    color: projectSelectedColor,
    section: section
  };

  if (!appData.projects) appData.projects = [];
  appData.projects.push(newProj);
  saveData();

  apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(newProj)
  }).catch(() => {});

  closeAddProjectModal();
  showToast(`📁 Project '${name}' created under ${section === 'team' ? 'Team' : 'My Projects'}`);
}

// ── Category Management ─────────────────────

function openAddCategoryModal() {
  selectedColor = CATEGORY_COLORS[0];
  $('categoryNameInput').value = '';
  $('saveCategoryBtn').disabled = true;
  renderColorPicker('colorPickerGrid', selectedColor, (color) => {
    selectedColor = color;
  });
  $('addCategoryModal').classList.add('open');
  setTimeout(() => $('categoryNameInput').focus(), 100);
}

function closeAddCategoryModal() {
  $('addCategoryModal').classList.remove('open');
}

function saveNewCategory() {
  const name = $('categoryNameInput').value.trim();
  if (!name) return;

  const newCat = {
    id: 'cat-' + (++appData.nextCategoryId),
    name: name,
    color: selectedColor
  };

  appData.categories.push(newCat);
  saveData();

  apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(newCat)
  }).catch(() => {});

  closeAddCategoryModal();
  showToast(`🏷️ Category '${name}' created`);
}

function openEditCategoryModal(catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;
  editingCategoryId = catId;
  $('editCategoryNameInput').value = cat.name;
  renderColorPicker('editColorPickerGrid', cat.color, (color) => {
    cat.color = color;
  });
  $('editCategoryModal').classList.add('open');
}

function closeEditCategoryModal() {
  $('editCategoryModal').classList.remove('open');
  editingCategoryId = null;
}

function saveEditCategory() {
  if (!editingCategoryId) return;
  const cat = getCategoryById(editingCategoryId);
  if (!cat) return;
  const name = $('editCategoryNameInput').value.trim();
  if (!name) return;

  cat.name = name;
  saveData();

  apiFetch(`/categories/${cat.id}`, {
    method: 'PUT',
    body: JSON.stringify(cat)
  }).catch(() => {});

  closeEditCategoryModal();
}

function deleteCategory() {
  if (!editingCategoryId) return;
  const catId = editingCategoryId;
  appData.tasks.forEach(t => { if (t.categoryId === catId) t.categoryId = ''; });
  appData.categories = appData.categories.filter(c => c.id !== catId);
  if (appData.currentView === 'category-' + catId) appData.currentView = 'today';
  saveData();

  apiFetch(`/categories/${catId}`, { method: 'DELETE' }).catch(() => {});
  closeEditCategoryModal();
  showToast('Category deleted');
}

function renderColorPicker(containerId, selected, onSelect) {
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = CATEGORY_COLORS.map(color => `
    <div class="color-picker-item${color === selected ? ' selected' : ''}" 
         style="background: ${color}" data-color="${color}"></div>
  `).join('');

  container.querySelectorAll('.color-picker-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.color-picker-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      onSelect(item.dataset.color);
    });
  });
}

function showCategoryContextMenu(e, catId) {
  e.preventDefault();
  const menu = $('contextMenu');
  if (!menu) return;
  menu.innerHTML = `
    <button class="context-menu-item" data-action="editCat" data-cat-id="${catId}">Edit</button>
    <button class="context-menu-item danger" data-action="deleteCat" data-cat-id="${catId}">Delete</button>
  `;
  menu.style.top = e.clientY + 'px';
  menu.style.left = e.clientX + 'px';
  menu.classList.add('open');

  menu.querySelector('[data-action="editCat"]').addEventListener('click', () => {
    menu.classList.remove('open');
    openEditCategoryModal(catId);
  });
  menu.querySelector('[data-action="deleteCat"]').addEventListener('click', () => {
    menu.classList.remove('open');
    editingCategoryId = catId;
    deleteCategory();
  });
}

// ── View Switching ──────────────────────────
function switchView(view) {
  appData.currentView = view;
  saveLocalData();

  document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });

  renderAll();
}

// ── Authentication Handlers ─────────────────

function initAuthUI() {
  const userProfile = $('userProfile');
  const userDropdown = $('userDropdown');
  const openAuthModalBtn = $('openAuthModalBtn');
  const authModal = $('authModal');
  const closeAuthModal = $('closeAuthModal');
  const signOutBtn = $('signOutBtn');

  const tabSignIn = $('tabSignIn');
  const tabSignUp = $('tabSignUp');
  const signInForm = $('signInForm');
  const signUpForm = $('signUpForm');

  if (userProfile && userDropdown) {
    userProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
      $('notifDropdown')?.classList.remove('open');
    });
  }

  if (openAuthModalBtn && authModal) {
    openAuthModalBtn.addEventListener('click', () => {
      userDropdown?.classList.remove('open');
      authModal.classList.add('open');
    });
  }

  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => {
      authModal.classList.remove('open');
    });
  }

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      signInForm.style.display = 'block';
      signUpForm.style.display = 'none';
    });

    tabSignUp.addEventListener('click', () => {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      signUpForm.style.display = 'block';
      signInForm.style.display = 'none';
    });
  }

  // Sign In submit
  if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('signInEmail').value.trim();
      const password = $('signInPassword').value.trim();
      const errEl = $('signInError');
      errEl.style.display = 'none';

      try {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        currentUser = res.user;
        saveLocalData();
        updateUserUI();
        authModal.classList.remove('open');
        showToast(`👋 Welcome back, ${currentUser.name}!`);
      } catch (err) {
        // Fallback check against local users
        const localUser = (appData.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
        if (localUser) {
          currentUser = localUser;
          saveLocalData();
          updateUserUI();
          authModal.classList.remove('open');
          showToast(`👋 Welcome back, ${currentUser.name}!`);
        } else {
          errEl.textContent = 'Invalid email or password.';
          errEl.style.display = 'block';
        }
      }
    });
  }

  // Sign Up submit (Create own password)
  if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('signUpName').value.trim();
      const email = $('signUpEmail').value.trim();
      const password = $('signUpPassword').value.trim();
      const errEl = $('signUpError');
      const succEl = $('signUpSuccess');
      errEl.style.display = 'none';
      succEl.style.display = 'none';

      try {
        const res = await apiFetch('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({ name, email, password })
        });
        currentUser = res.user;
        if (!appData.users) appData.users = [];
        appData.users.push(currentUser);
        saveLocalData();
        updateUserUI();
        succEl.textContent = 'Account created successfully!';
        succEl.style.display = 'block';
        setTimeout(() => {
          authModal.classList.remove('open');
          showToast(`🎉 Account created! Welcome, ${name}!`);
        }, 800);
      } catch (err) {
        // Offline registration fallback
        currentUser = { id: 'user-' + Date.now(), name, email, password };
        if (!appData.users) appData.users = [];
        appData.users.push(currentUser);
        saveLocalData();
        updateUserUI();
        authModal.classList.remove('open');
        showToast(`🎉 Account created offline! Welcome, ${name}!`);
      }
    });
  }

  // Sign out button
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      currentUser = { id: 'guest', name: 'Guest User', email: 'guest@example.com' };
      saveLocalData();
      updateUserUI();
      userDropdown?.classList.remove('open');
      showToast('🔒 Signed out. Click profile to sign back in.');
    });
  }
}

// ── Notification Popup & Trigger System ─────

function initNotificationUI() {
  const notifBtn = $('notifBtn');
  const notifDropdown = $('notifDropdown');
  const triggerAlertBtn = $('triggerAlertBtn');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('open');
      $('userDropdown')?.classList.remove('open');
    });
  }

  // Trigger notification popup button ("i need to pop up the notification and trigger")
  if (triggerAlertBtn) {
    triggerAlertBtn.addEventListener('click', () => {
      playChime();
      const firstDue = appData.tasks.find(t => !t.completed && (t.alarm || t.time)) || appData.tasks[0];
      const alertMsg = firstDue ? `🔔 Alert Trigger: '${firstDue.text}' is due soon!` : '🔔 Alert Triggered: You have tasks scheduled for today!';
      showToast(alertMsg);

      // Trigger standard browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Todoist Alert', { body: alertMsg, icon: 'avatar.jpg' });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    });
  }
}

// ── Mobile Application Implementation ────────

function initMobileApp() {
  const btnDesktop = $('btnDesktopView');
  const btnMobile = $('btnMobileView');

  if (btnDesktop && btnMobile) {
    btnDesktop.addEventListener('click', () => {
      document.body.classList.remove('mobile-mode');
      btnDesktop.classList.add('active');
      btnMobile.classList.remove('active');
    });

    btnMobile.addEventListener('click', () => {
      document.body.classList.add('mobile-mode');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
      renderMobileBody();
    });
  }

  // Mobile drawer
  const drawerBtn = $('mobileDrawerBtn');
  const drawerOverlay = $('mobileDrawerOverlay');
  const drawerCloseBtn = $('mobileDrawerCloseBtn');

  if (drawerBtn && drawerOverlay) {
    drawerBtn.addEventListener('click', () => {
      drawerOverlay.classList.add('open');
      mobileState.drawerOpen = true;
      renderMobileDrawer();
    });
  }
  if (drawerCloseBtn && drawerOverlay) {
    drawerCloseBtn.addEventListener('click', () => {
      drawerOverlay.classList.remove('open');
      mobileState.drawerOpen = false;
    });
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        drawerOverlay.classList.remove('open');
        mobileState.drawerOpen = false;
      }
    });
  }

  // Mobile Bottom Nav tabs
  const tabs = [
    { id: 'mobileTabTasks', tab: 'tasks' },
    { id: 'mobileTabCalendar', tab: 'calendar' },
    { id: 'mobileTabCategories', tab: 'categories' },
    { id: 'mobileTabMore', tab: 'more' }
  ];

  tabs.forEach(({ id, tab }) => {
    const el = $(id);
    if (el) {
      el.addEventListener('click', () => {
        tabs.forEach(t => $(t.id)?.classList.remove('active'));
        el.classList.add('active');
        mobileState.activeTab = tab;
        renderMobileBody();
      });
    }
  });

  // Mobile FAB button opens quick-add bottom sheet
  const mobileFab = $('mobileFab');
  const sheetOverlay = $('mobileBottomSheetOverlay');
  if (mobileFab && sheetOverlay) {
    mobileFab.addEventListener('click', () => {
      openMobileBottomSheet();
    });
    sheetOverlay.addEventListener('click', (e) => {
      if (e.target === sheetOverlay) closeMobileBottomSheet();
    });
  }

  initMobileBottomSheet();
}

function openMobileBottomSheet() {
  const sheetOverlay = $('mobileBottomSheetOverlay');
  const input = $('sheetTaskInput');
  const select = $('sheetCategorySelect');

  // Populate category/project selector
  if (select) {
    let optionsHtml = '';
    optionsHtml += '<optgroup label="Section">';
    optionsHtml += '<option value="sec:myProjects">👤 My Projects</option>';
    optionsHtml += '<option value="sec:team">👥 Team</option>';
    optionsHtml += '</optgroup>';

    optionsHtml += '<optgroup label="Categories">';
    appData.categories.forEach(c => {
      optionsHtml += `<option value="cat:${c.id}">@ ${esc(c.name)}</option>`;
    });
    optionsHtml += '</optgroup>';

    optionsHtml += '<optgroup label="Projects">';
    appData.projects.forEach(p => {
      optionsHtml += `<option value="proj:${p.id}"># ${esc(p.name)} (${p.section === 'team' ? 'Team' : 'My'})</option>`;
    });
    optionsHtml += '</optgroup>';

    select.innerHTML = optionsHtml;
  }

  sheetOverlay.classList.add('open');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 150);
  }
}

function closeMobileBottomSheet() {
  const sheetOverlay = $('mobileBottomSheetOverlay');
  if (sheetOverlay) sheetOverlay.classList.remove('open');
}

function initMobileBottomSheet() {
  const datePill = $('sheetDatePill');
  const datePillText = $('sheetDatePillText');
  const chipDate = $('sheetChipDate');
  const sendBtn = $('sheetSendBtn');
  const taskInput = $('sheetTaskInput');
  const timeInput = $('sheetTimeInput');
  const catSelect = $('sheetCategorySelect');

  const dates = ['Today', 'Tomorrow', 'Next 7 Days'];
  let dateIndex = 1; // Default Tomorrow

  if (datePill) {
    datePill.addEventListener('click', () => {
      dateIndex = (dateIndex + 1) % dates.length;
      const dName = dates[dateIndex];
      datePillText.textContent = dName;
      if (chipDate) chipDate.textContent = dName.toLowerCase();
    });
  }

  function submitMobileTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    let targetDate = 'tomorrow';
    if (dates[dateIndex] === 'Today') targetDate = 'today';
    else if (dates[dateIndex] === 'Next 7 Days') targetDate = 'upcoming';

    let section = 'myProjects';
    let categoryId = appData.categories[0]?.id || '';
    let projectId = '';

    if (catSelect && catSelect.value) {
      const parts = catSelect.value.split(':');
      if (parts[0] === 'sec') {
        section = parts[1];
      } else if (parts[0] === 'cat') {
        categoryId = parts[1];
      } else if (parts[0] === 'proj') {
        projectId = parts[1];
        const proj = getProjectById(projectId);
        if (proj) section = proj.section;
      }
    }

    const taskTime = timeInput ? timeInput.value : '';

    const newTask = {
      id: uid('t'),
      text: text,
      completed: false,
      time: formatTimeForDisplay(taskTime),
      recurring: false,
      alarm: !!taskTime,
      calendar: false,
      section: section,
      projectId: projectId,
      categoryId: categoryId,
      priority: 'default',
      date: targetDate
    };

    appData.tasks.push(newTask);
    saveData();

    apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(newTask)
    }).catch(() => {});

    closeMobileBottomSheet();
    renderAll();
    showToast(`📱 Task created in mobile ${section === 'team' ? 'Team' : 'My Projects'}`);
  }

  if (sendBtn) sendBtn.addEventListener('click', submitMobileTask);
  if (taskInput) {
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitMobileTask();
    });
  }
}

function renderMobileDrawer() {
  const container = $('mobileDrawerNav');
  if (!container) return;

  const myProjects = (appData.projects || []).filter(p => p.section === 'myProjects');
  const teamProjects = (appData.projects || []).filter(p => p.section === 'team');

  let html = `
    <div class="sidebar-nav" style="padding:0 0 8px 0;">
      <button class="nav-item${appData.currentView === 'inbox' ? ' active' : ''}" data-mobile-view="inbox">
        <span class="nav-label">📥 Inbox</span>
      </button>
      <button class="nav-item${appData.currentView === 'today' ? ' active' : ''}" data-mobile-view="today">
        <span class="nav-label">📅 Today</span>
      </button>
      <button class="nav-item${appData.currentView === 'upcoming' ? ' active' : ''}" data-mobile-view="upcoming">
        <span class="nav-label">🗓️ Upcoming</span>
      </button>
    </div>

    <!-- My Projects Section -->
    <div class="sidebar-section" style="padding:6px 0;">
      <div class="section-header">
        <span class="section-title">My Projects</span>
        <button class="section-add-btn" id="drawerAddMyProjBtn" title="Add project">+</button>
      </div>
      <div class="section-items">
        ${myProjects.map(p => `
          <button class="nav-item project-item" data-mobile-view="project-${p.id}">
            <span class="project-icon hash" style="color: ${p.color}">#</span>
            <span class="nav-label">${esc(p.name)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Categories Section -->
    <div class="sidebar-section" style="padding:6px 0;">
      <div class="section-header">
        <span class="section-title">Categories</span>
      </div>
      <div class="section-items">
        ${appData.categories.map(c => `
          <button class="nav-item category-item" data-mobile-view="category-${c.id}">
            <span class="category-dot" style="background:${c.color}"></span>
            <span class="nav-label">${esc(c.name)}</span>
            <span class="nav-count">${getTaskCountForCategory(c.id)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Team Section -->
    <div class="sidebar-section" style="padding:6px 0;">
      <div class="section-header">
        <span class="section-title">Team Projects</span>
        <button class="section-add-btn" id="drawerAddTeamProjBtn" title="Add project">+</button>
      </div>
      <div class="section-items">
        ${teamProjects.map(p => `
          <button class="nav-item project-item" data-mobile-view="project-${p.id}">
            <span class="project-icon hash" style="color: ${p.color}">#</span>
            <span class="nav-label">${esc(p.name)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('[data-mobile-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.mobileView);
      $('mobileDrawerOverlay').classList.remove('open');
      mobileState.drawerOpen = false;
      mobileState.activeTab = 'tasks';
      $('mobileTabTasks')?.classList.add('active');
      $('mobileTabCalendar')?.classList.remove('active');
      $('mobileTabCategories')?.classList.remove('active');
      $('mobileTabMore')?.classList.remove('active');
    });
  });

  // Drawer project add buttons
  $('drawerAddMyProjBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    $('mobileDrawerOverlay').classList.remove('open');
    openAddProjectModal('myProjects');
  });
  $('drawerAddTeamProjBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    $('mobileDrawerOverlay').classList.remove('open');
    openAddProjectModal('team');
  });
}

function renderMobileBody() {
  const container = $('mobileBody');
  const titleEl = $('mobileViewTitle');
  if (!container || !titleEl) return;

  if (mobileState.activeTab === 'calendar') {
    titleEl.textContent = 'September';
    renderMobileCalendarView(container);
    return;
  }

  if (mobileState.activeTab === 'categories') {
    titleEl.textContent = 'Categories';
    renderMobileCategoriesHub(container);
    return;
  }

  if (mobileState.activeTab === 'more') {
    titleEl.textContent = 'Settings & Profile';
    renderMobileMoreView(container);
    return;
  }

  // Tasks Tab: renders active view inside mobile
  if (appData.currentView.startsWith('category-')) {
    const catId = appData.currentView.replace('category-', '');
    const cat = getCategoryById(catId);
    titleEl.textContent = cat ? cat.name : 'Category';
    renderCategoryView(container, catId);
  } else if (appData.currentView === 'inbox') {
    titleEl.textContent = 'Inbox';
    renderInboxView(container);
  } else if (appData.currentView === 'upcoming') {
    titleEl.textContent = 'Upcoming';
    renderUpcomingView(container);
  } else {
    titleEl.textContent = 'Today';
    renderTodayView(container);
  }
}

function renderMobileCalendarView(container) {
  let html = `
    <div class="mobile-cal-header">
      <div class="mobile-cal-month">September 2026</div>
      <div class="mobile-day-strip">
        <div class="day-pill" data-day="5"><span class="day-pill-letter">M</span><span class="day-pill-number">21</span></div>
        <div class="day-pill active" data-day="6"><span class="day-pill-letter">T</span><span class="day-pill-number">22</span></div>
        <div class="day-pill" data-day="7"><span class="day-pill-letter">W</span><span class="day-pill-number">23</span></div>
        <div class="day-pill" data-day="8"><span class="day-pill-letter">T</span><span class="day-pill-number">24</span></div>
        <div class="day-pill" data-day="9"><span class="day-pill-letter">F</span><span class="day-pill-number">25</span></div>
      </div>
    </div>

    <div class="schedule-timeline">
      ${appData.tasks.filter(t => t.time && !t.completed).map(t => `
        <div class="timeline-row">
          <span class="timeline-time">${t.time}</span>
          <div class="timeline-card" style="border-left: 4px solid ${getCategoryById(t.categoryId)?.color || '#246FE0'};">
            <span>${esc(t.text)}</span>
            <span class="timeline-card-sub">${getCategoryById(t.categoryId)?.name || 'General'} · ${t.section === 'team' ? 'Team' : 'My Projects'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.innerHTML = html;
}

function renderMobileCategoriesHub(container) {
  let html = `
    <div class="categories-hub-grid">
      ${appData.categories.map(cat => {
        const count = getTaskCountForCategory(cat.id);
        return `
          <div class="category-hub-card" data-cat-id="${cat.id}">
            <div class="category-hub-top">
              <span class="category-hub-dot" style="background:${cat.color}"></span>
              <span class="category-hub-badge">${count} tasks</span>
            </div>
            <div class="category-hub-name">${esc(cat.name)}</div>
          </div>`;
      }).join('')}
    </div>
    <div style="padding:16px;">
      <button class="mobile-add-category-btn" id="mobileAddCatBtn">+ Add New Category</button>
    </div>
  `;
  container.innerHTML = html;

  container.querySelectorAll('.category-hub-card').forEach(card => {
    card.addEventListener('click', () => {
      switchView('category-' + card.dataset.catId);
      mobileState.activeTab = 'tasks';
      $('mobileTabTasks')?.classList.add('active');
      $('mobileTabCategories')?.classList.remove('active');
    });
  });

  $('mobileAddCatBtn')?.addEventListener('click', () => {
    openAddCategoryModal();
  });
}

function renderMobileMoreView(container) {
  container.innerHTML = `
    <div style="padding: 20px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
        <div class="user-avatar" style="width:48px; height:48px; font-size:20px;">
          <img src="avatar.jpg" alt="User Avatar" class="user-avatar-img">
        </div>
        <div>
          <div style="font-size:16px; font-weight:700;">${esc(currentUser.name)}</div>
          <div style="font-size:13px; color:#888;">${esc(currentUser.email)}</div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <button class="btn-submit" id="mobileAuthBtn" style="width:100%;">Sign In / Switch Account</button>
        <button class="btn-cancel" id="mobileSwitchDesktopBtn" style="width:100%;">Switch to Desktop View</button>
        <button class="btn-cancel" id="mobileTriggerAlertBtn" style="width:100%; color:#DC4C3E;">🔔 Trigger Alert Notification</button>
      </div>
    </div>
  `;

  $('mobileAuthBtn')?.addEventListener('click', () => {
    $('authModal')?.classList.add('open');
  });

  $('mobileSwitchDesktopBtn')?.addEventListener('click', () => {
    $('btnDesktopView')?.click();
  });

  $('mobileTriggerAlertBtn')?.addEventListener('click', () => {
    $('triggerAlertBtn')?.click();
  });
}

// ── Global Initialization ───────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Load data & verify connection
  await loadData();
  checkServerConnection();
  setInterval(checkServerConnection, 8000);

  // Initialize UI features
  initAuthUI();
  initNotificationUI();
  initMobileApp();

  // Desktop Add Project buttons (`+` icon)
  $('addMyProjectBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddProjectModal('myProjects');
  });
  $('addTeamProjectBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddProjectModal('team');
  });

  $('closeAddProjectModal')?.addEventListener('click', closeAddProjectModal);
  $('cancelProjectBtn')?.addEventListener('click', closeAddProjectModal);
  $('saveProjectBtn')?.addEventListener('click', saveNewProject);

  $('projectNameInput')?.addEventListener('input', () => {
    $('saveProjectBtn').disabled = !$('projectNameInput').value.trim();
  });

  // Edit Task modal buttons
  $('closeEditTaskModal')?.addEventListener('click', closeEditTaskModal);
  $('cancelEditTaskBtn')?.addEventListener('click', closeEditTaskModal);
  $('saveEditTaskBtn')?.addEventListener('click', saveEditTask);
  $('deleteTaskFromModalBtn')?.addEventListener('click', () => {
    if (editingTaskId) {
      deleteTask(editingTaskId);
      closeEditTaskModal();
    }
  });

  // Schedule modal buttons
  $('closeScheduleModal')?.addEventListener('click', closeScheduleModal);
  $('cancelScheduleBtn')?.addEventListener('click', closeScheduleModal);
  $('saveScheduleBtn')?.addEventListener('click', applySchedule);

  document.querySelectorAll('.schedule-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.schedule-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleSelectedDate = btn.dataset.scheduleDate;
    });
  });

  // Category modal buttons
  $('addCategoryBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddCategoryModal();
  });
  $('closeCategoryModal')?.addEventListener('click', closeAddCategoryModal);
  $('cancelCategoryBtn')?.addEventListener('click', closeAddCategoryModal);
  $('saveCategoryBtn')?.addEventListener('click', saveNewCategory);
  $('categoryNameInput')?.addEventListener('input', () => {
    $('saveCategoryBtn').disabled = !$('categoryNameInput').value.trim();
  });

  $('closeEditCategoryModal')?.addEventListener('click', closeEditCategoryModal);
  $('cancelEditCategoryBtn')?.addEventListener('click', closeEditCategoryModal);
  $('saveEditCategoryBtn')?.addEventListener('click', saveEditCategory);
  $('deleteCategoryBtn')?.addEventListener('click', deleteCategory);

  // Global click to close popovers
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#notifDropdown') && !e.target.closest('#notifBtn')) {
      $('notifDropdown')?.classList.remove('open');
    }
    if (!e.target.closest('#userDropdown') && !e.target.closest('#userProfile')) {
      $('userDropdown')?.classList.remove('open');
    }
    if (!e.target.closest('#contextMenu')) {
      $('contextMenu')?.classList.remove('open');
    }
    if (!e.target.closest('.category-select-wrapper')) {
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        d.classList.remove('open');
      });
    }
  });

  // Initial render
  renderAll();
});
