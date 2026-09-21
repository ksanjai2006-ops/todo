/* ============================================
   TODOIST REPLICA — App Logic
   ============================================ */

// ── Data Model ──────────────────────────────
const CATEGORY_COLORS = [
  '#DC4C3E', '#EB8909', '#FF9A14', '#E8A500',
  '#058527', '#299438', '#14AAF5', '#246FE0',
  '#692FC2', '#AF38EB', '#EB96EB', '#B8255F',
  '#FF8D85', '#808080', '#333333', '#6C7A21'
];

const DEFAULT_DATA = {
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
    // Today — My Projects
    { id: 't-1', text: 'Do 30 minutes of yoga 🧘', completed: false, time: '7:30 AM', recurring: true, alarm: true, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'today' },
    { id: 't-2', text: 'Dentist appointment', completed: false, time: '10:00 AM', calendarIcon: true, alarm: true, recurring: false, section: 'myProjects', projectId: 'proj-3', categoryId: 'cat-2', priority: 'default', date: 'today' },
    { id: 't-3', text: 'Buy bread 🍞', completed: false, time: '', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'today' },
    // Today — Team
    { id: 't-4', text: 'Plan user research sessions', completed: false, time: '2:00 PM', calendarIcon: true, calendarTag: true, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'blue', date: 'today' },
    { id: 't-5', text: "Provide feedback on Amy's design", completed: false, time: '', calendar: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'today' },
    { id: 't-6', text: 'All-hands meeting', completed: false, time: '', recurring: true, section: 'team', projectId: 'proj-7', categoryId: 'cat-1', priority: 'default', date: 'today' },
    // Tomorrow
    { id: 't-7', text: 'Morning Run', completed: false, time: '07:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-3', priority: 'default', date: 'tomorrow' },
    { id: 't-8', text: 'Go Grocery Shopping', completed: false, time: '09:00', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'tomorrow' },
    { id: 't-9', text: 'Reply to Emails', completed: false, time: '12:00', recurring: false, section: 'team', projectId: 'proj-5', categoryId: 'cat-1', priority: 'default', date: 'tomorrow' },
    { id: 't-10', text: 'Discuss Plan with Client', completed: false, time: '13:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'blue', date: 'tomorrow' },
    // Upcoming
    { id: 't-11', text: 'Shoot Video', completed: false, time: '08:00', recurring: false, section: 'myProjects', projectId: 'proj-1', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-12', text: 'Host Project Meeting', completed: false, time: '14:00', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-13', text: 'Finalize Promo Video', completed: false, time: '17:30', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'orange', date: 'upcoming' },
    { id: 't-14', text: 'Pick Up Package', completed: false, time: 'Mon', recurring: false, section: 'myProjects', projectId: 'proj-2', categoryId: 'cat-4', priority: 'default', date: 'upcoming' },
    { id: 't-15', text: 'Organize Project Meeting', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-6', categoryId: 'cat-1', priority: 'default', date: 'upcoming' },
    { id: 't-16', text: 'Complete Client Proposal', completed: false, time: 'Mon', recurring: false, section: 'team', projectId: 'proj-4', categoryId: 'cat-1', priority: 'red', date: 'upcoming' },
    // Inbox
    { id: 't-17', text: 'Read new design articles', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-5', priority: 'default', date: 'inbox' },
    { id: 't-18', text: 'Update portfolio website', completed: false, time: '', recurring: false, section: 'myProjects', projectId: '', categoryId: 'cat-2', priority: 'default', date: 'inbox' }
  ],
  currentView: 'today',
  version: 2,
  nextTaskId: 19,
  nextCategoryId: 6
};

// ── State ───────────────────────────────────
let appData;

function loadData() {
  try {
    const saved = localStorage.getItem('todoist_replica_data');
    if (saved) {
      appData = JSON.parse(saved);
      // Migrate or reset to match replica version 2
      if (!appData.version || appData.version < 2) {
        appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData();
      }
      if (!appData.nextTaskId) appData.nextTaskId = 100;
      if (!appData.nextCategoryId) appData.nextCategoryId = 100;
    } else {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  } catch (e) {
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData() {
  try {
    localStorage.setItem('todoist_replica_data', JSON.stringify(appData));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

// ── Helpers ─────────────────────────────────
function $(id) { return document.getElementById(id); }
function esc(str) {
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

// ── Rendering ───────────────────────────────

// Sidebar categories
function renderSidebarCategories() {
  const container = $('categoriesItems');
  container.innerHTML = appData.categories.map(cat => {
    const count = getTaskCountForCategory(cat.id);
    return `
      <button class="nav-item category-item${appData.currentView === 'category-' + cat.id ? ' active' : ''}" 
              data-category="${cat.id}" 
              oncontextmenu="showCategoryContextMenu(event, '${cat.id}')">
        <span class="category-dot" style="background: ${cat.color}"></span>
        <span class="nav-label">${esc(cat.name)}</span>
        <span class="nav-count">${count}</span>
      </button>`;
  }).join('');

  // Click handlers
  container.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.button === 2) return;
      const catId = btn.dataset.category;
      switchView('category-' + catId);
    });
  });
}

// Main content
function renderMainContent() {
  const view = appData.currentView;
  const mainBody = $('mainBody');
  const viewTitle = $('viewTitle');

  if (view === 'today') {
    viewTitle.textContent = 'Today';
    renderTodayView(mainBody);
  } else if (view === 'inbox') {
    viewTitle.textContent = 'Inbox';
    renderInboxView(mainBody);
  } else if (view === 'upcoming') {
    viewTitle.textContent = 'Upcoming';
    renderUpcomingView(mainBody);
  } else if (view === 'filters') {
    viewTitle.textContent = 'Filters & Labels';
    renderFiltersView(mainBody);
  } else if (view.startsWith('category-')) {
    const catId = view.replace('category-', '');
    const cat = getCategoryById(catId);
    if (cat) {
      viewTitle.innerHTML = `<span class="category-view-header"><span class="category-view-dot" style="background:${cat.color}"></span> ${esc(cat.name)}</span>`;
      renderCategoryView(mainBody, catId);
    }
  }
}

function renderTodayView(container) {
  const todayTasks = appData.tasks.filter(t => t.date === 'today' && !t.completed);
  const myProjectTasks = todayTasks.filter(t => t.section === 'myProjects');
  const teamTasks = todayTasks.filter(t => t.section === 'team');

  let html = '';

  // My Projects section
  html += `
    <div class="task-section">
      <div class="content-section-title">My Projects</div>
      <div class="task-list">
        ${myProjectTasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline('myProjects', 'today')}
    </div>`;

  // Team section
  html += `
    <div class="task-section">
      <div class="content-section-title">Team</div>
      <div class="task-list">
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
      <div class="task-list">
        ${inboxTasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline('inbox', 'inbox')}
    </div>`;

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderUpcomingView(container) {
  const tomorrowTasks = appData.tasks.filter(t => t.date === 'tomorrow' && !t.completed);
  const upcomingTasks = appData.tasks.filter(t => t.date === 'upcoming' && !t.completed);

  let html = '';
  html += renderTaskSection('Tomorrow', tomorrowTasks, 'myProjects', 'tomorrow', tomorrowTasks.length);
  html += renderTaskSection('Next 7 Days', upcomingTasks, 'myProjects', 'upcoming', upcomingTasks.length);

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderFiltersView(container) {
  container.innerHTML = `
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="empty-state-title">Filters & Labels</div>
      <div class="empty-state-text">Create custom filters to view tasks across projects.</div>
    </div>`;
}

function renderCategoryView(container, catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;

  const categoryTasks = appData.tasks.filter(t => t.categoryId === catId && !t.completed);

  // Group by date
  const todayTasks = categoryTasks.filter(t => t.date === 'today');
  const tomorrowTasks = categoryTasks.filter(t => t.date === 'tomorrow');
  const upcomingTasks = categoryTasks.filter(t => t.date === 'upcoming');
  const inboxTasks = categoryTasks.filter(t => t.date === 'inbox');

  let html = '';

  if (todayTasks.length > 0) {
    html += renderTaskSectionSimple('Today', todayTasks, todayTasks.length);
  }
  if (tomorrowTasks.length > 0) {
    html += renderTaskSectionSimple('Tomorrow', tomorrowTasks, tomorrowTasks.length);
  }
  if (upcomingTasks.length > 0) {
    html += renderTaskSectionSimple('Upcoming', upcomingTasks, upcomingTasks.length);
  }
  if (inboxTasks.length > 0) {
    html += renderTaskSectionSimple('Inbox', inboxTasks, inboxTasks.length);
  }

  if (categoryTasks.length === 0) {
    html = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="empty-state-title">No tasks in ${esc(cat.name)}</div>
        <div class="empty-state-text">Tasks assigned to this category will appear here.</div>
      </div>`;
  }

  // Add task button for category view
  html += renderAddTaskInline('myProjects', 'today', catId);

  container.innerHTML = html;
  attachTaskListeners(container);
}

function renderTaskSection(title, tasks, defaultSection, defaultDate, count) {
  return `
    <div class="task-section">
      <div class="task-section-header">
        <svg class="section-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="task-section-title">${esc(title)}</span>
        ${count !== undefined ? `<span class="task-section-count">${count}</span>` : ''}
      </div>
      <div class="task-list">
        ${tasks.map(t => renderTaskItem(t)).join('')}
      </div>
      ${renderAddTaskInline(defaultSection, defaultDate)}
    </div>`;
}

function renderTaskSectionSimple(title, tasks, count) {
  return `
    <div class="task-section">
      <div class="task-section-header">
        <svg class="section-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="task-section-title">${esc(title)}</span>
        <span class="task-section-count">${count}</span>
      </div>
      <div class="task-list">
        ${tasks.map(t => renderTaskItem(t)).join('')}
      </div>
    </div>`;
}

function renderTaskItem(task) {
  const cat = getCategoryById(task.categoryId);
  const priorityClass = task.priority && task.priority !== 'default' ? `priority-${task.priority}` : '';

  let metaHtml = '';
  const isGreenTime = (task.date === 'today' || appData.currentView === 'today');

  if (task.time) {
    metaHtml += `
      <span class="task-meta-item ${isGreenTime ? 'green' : ''}">
        ${task.recurring ? `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="margin-right:2px">
            <path d="M1 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.51 15a9 9 0 105.64-12.36L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>` : `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="margin-right:2px">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>`}
        <span>${esc(task.time)}</span>
        ${task.alarm ? `
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style="margin-left:2px">
            <circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M12 9v4l2.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 3L2 6M19 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>` : ''}
      </span>`;
  } else if (task.recurring) {
    metaHtml += `
      <span class="task-meta-item ${isGreenTime ? 'green' : ''}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M1 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3.51 15a9 9 0 105.64-12.36L1 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>`;
  }

  if (task.calendarTag) {
    metaHtml += `
      <span class="task-meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>Calendar</span>
      </span>`;
  }

  if (cat) {
    metaHtml += `
      <span class="task-category-pill" onclick="event.stopPropagation(); switchView('category-${cat.id}')" title="Category: ${esc(cat.name)}">
        <span class="cat-dot" style="background: ${cat.color}"></span>
        ${esc(cat.name)}
      </span>`;
  }

  return `
    <div class="task-item${task.completed ? ' completed' : ''}" data-task-id="${task.id}">
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
        <button class="task-action-btn" title="Edit" data-action="edit" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="task-action-btn" title="Schedule" data-action="schedule" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="task-action-btn delete" title="Delete" data-action="delete" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>`;
}

function renderAddTaskInline(defaultSection, defaultDate, defaultCategoryId) {
  const formId = `form-${defaultSection}-${defaultDate}-${defaultCategoryId || 'none'}`;
  return `
    <button class="add-task-inline" data-form="${formId}">
      <span class="add-task-plus">+</span>
      <span>Add task</span>
    </button>
    <div class="add-task-form" id="${formId}">
      <input class="add-task-form-input" type="text" placeholder="Task name" data-form-id="${formId}">
      <textarea class="add-task-form-desc" placeholder="Description" rows="1" data-form-id="${formId}"></textarea>
      <div class="add-task-form-toolbar">
        <div class="category-select-wrapper">
          <button class="toolbar-btn" data-action="selectCategory" data-form-id="${formId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="7" cy="7" r="1" fill="currentColor"/>
            </svg>
            <span class="toolbar-btn-label" data-role="categoryLabel">${defaultCategoryId ? esc(getCategoryById(defaultCategoryId)?.name || 'Category') : 'Category'}</span>
          </button>
          <div class="category-select-dropdown" data-form-id="${formId}">
            <button class="category-option" data-cat-id="">
              <span class="category-dot" style="background: #C4C4C4"></span>
              No category
            </button>
            ${appData.categories.map(c => `
              <button class="category-option${defaultCategoryId === c.id ? ' selected' : ''}" data-cat-id="${c.id}">
                <span class="category-dot" style="background: ${c.color}"></span>
                ${esc(c.name)}
              </button>`).join('')}
          </div>
        </div>
        <div class="category-select-wrapper">
          <button class="toolbar-btn" data-action="selectPriority" data-form-id="${formId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 22v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span data-role="priorityLabel">Priority</span>
          </button>
          <div class="priority-select-dropdown" data-form-id="${formId}">
            <button class="priority-option" data-priority="default">
              <span class="priority-circle-sm" style="border-color: #C4C4C4"></span> Default
            </button>
            <button class="priority-option" data-priority="blue">
              <span class="priority-circle-sm" style="border-color: #246FE0"></span> Low
            </button>
            <button class="priority-option" data-priority="orange">
              <span class="priority-circle-sm" style="border-color: #FF9A14"></span> Medium
            </button>
            <button class="priority-option" data-priority="red">
              <span class="priority-circle-sm" style="border-color: #DC4C3E"></span> High
            </button>
          </div>
        </div>
      </div>
      <div class="add-task-form-actions">
        <div class="form-actions-left"></div>
        <div class="form-actions-right">
          <button class="btn-cancel" data-action="cancelForm" data-form-id="${formId}">Cancel</button>
          <button class="btn-submit" data-action="submitForm" data-form-id="${formId}" 
                  data-section="${defaultSection}" data-date="${defaultDate}" data-default-cat="${defaultCategoryId || ''}" disabled>Add task</button>
        </div>
      </div>
    </div>`;
}

// ── Event Binding ───────────────────────────
function attachTaskListeners(container) {
  // Checkbox clicks
  container.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = cb.dataset.taskId;
      toggleTaskComplete(taskId, cb.closest('.task-item'));
    });
  });

  // Task action buttons
  container.querySelectorAll('.task-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const taskId = btn.dataset.taskId;
      if (action === 'delete') {
        deleteTask(taskId);
      }
    });
  });

  // Add task inline buttons
  container.querySelectorAll('.add-task-inline').forEach(btn => {
    btn.addEventListener('click', () => {
      const formId = btn.dataset.form;
      openInlineForm(formId, btn);
    });
  });

  // Cancel form buttons
  container.querySelectorAll('[data-action="cancelForm"]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeInlineForm(btn.dataset.formId);
    });
  });

  // Submit form buttons
  container.querySelectorAll('[data-action="submitForm"]').forEach(btn => {
    btn.addEventListener('click', () => {
      submitInlineForm(btn);
    });
  });

  // Input change for submit button enable
  container.querySelectorAll('.add-task-form-input').forEach(input => {
    input.addEventListener('input', () => {
      const formId = input.dataset.formId;
      const form = $(formId);
      if (!form) return;
      const submitBtn = form.querySelector('[data-action="submitForm"]');
      if (submitBtn) {
        submitBtn.disabled = !input.value.trim();
      }
    });
    // Enter key to submit
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        const formId = input.dataset.formId;
        const form = $(formId);
        if (!form) return;
        const submitBtn = form.querySelector('[data-action="submitForm"]');
        if (submitBtn) submitBtn.click();
      }
      if (e.key === 'Escape') {
        closeInlineForm(input.dataset.formId);
      }
    });
  });

  // Category select in forms
  container.querySelectorAll('[data-action="selectCategory"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = btn.closest('.category-select-wrapper');
      const dropdown = wrapper.querySelector('.category-select-dropdown');
      // Close all other dropdowns
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  });

  container.querySelectorAll('.category-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const catId = opt.dataset.catId;
      const wrapper = opt.closest('.category-select-wrapper');
      const dropdown = opt.closest('.category-select-dropdown');
      const label = wrapper.querySelector('[data-role="categoryLabel"]');
      const cat = getCategoryById(catId);

      // Update selection
      dropdown.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      wrapper.dataset.selectedCategory = catId;

      if (cat) {
        label.textContent = cat.name;
        const btn = wrapper.querySelector('.toolbar-btn');
        btn.classList.add('has-value');
        btn.style.background = cat.color;
      } else {
        label.textContent = 'Category';
        const btn = wrapper.querySelector('.toolbar-btn');
        btn.classList.remove('has-value');
        btn.style.background = '';
      }
      dropdown.classList.remove('open');
    });
  });

  // Priority select in forms
  container.querySelectorAll('[data-action="selectPriority"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = btn.closest('.category-select-wrapper');
      const dropdown = wrapper.querySelector('.priority-select-dropdown');
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  });

  container.querySelectorAll('.priority-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const priority = opt.dataset.priority;
      const wrapper = opt.closest('.category-select-wrapper');
      const dropdown = opt.closest('.priority-select-dropdown');
      const label = wrapper.querySelector('[data-role="priorityLabel"]');

      wrapper.dataset.selectedPriority = priority;
      const names = { default: 'Default', blue: 'Low', orange: 'Medium', red: 'High' };
      label.textContent = names[priority] || 'Priority';
      dropdown.classList.remove('open');
    });
  });

  // Section header collapse
  container.querySelectorAll('.task-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const taskList = header.nextElementSibling;
      if (taskList && taskList.classList.contains('task-list')) {
        taskList.classList.toggle('collapsed');
        const chevron = header.querySelector('.section-chevron');
        if (chevron) {
          header.classList.toggle('collapsed');
          if (header.classList.contains('collapsed')) {
            chevron.style.transform = 'rotate(-90deg)';
          } else {
            chevron.style.transform = '';
          }
        }
      }
    });
  });
}

// ── Actions ─────────────────────────────────

function toggleTaskComplete(taskId, taskEl) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveData();

  if (task.completed && taskEl) {
    taskEl.classList.add('completing');
    setTimeout(() => {
      renderAll();
    }, 400);
  } else {
    renderAll();
  }
}

function deleteTask(taskId) {
  appData.tasks = appData.tasks.filter(t => t.id !== taskId);
  saveData();
  renderAll();
}

function openInlineForm(formId, triggerBtn) {
  // Close all open forms first
  document.querySelectorAll('.add-task-form.open').forEach(f => {
    f.classList.remove('open');
  });
  document.querySelectorAll('.add-task-inline').forEach(b => {
    b.style.display = '';
  });

  const form = $(formId);
  if (form) {
    form.classList.add('open');
    triggerBtn.style.display = 'none';
    const input = form.querySelector('.add-task-form-input');
    if (input) {
      input.focus();
      input.value = '';
    }
    const desc = form.querySelector('.add-task-form-desc');
    if (desc) desc.value = '';
  }
}

function closeInlineForm(formId) {
  const form = $(formId);
  if (form) {
    form.classList.remove('open');
    // Show the trigger button again
    const triggerBtn = form.previousElementSibling;
    if (triggerBtn) triggerBtn.style.display = '';
  }
}

function submitInlineForm(submitBtn) {
  const formId = submitBtn.dataset.formId;
  const form = $(formId);
  if (!form) return;

  const input = form.querySelector('.add-task-form-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const section = submitBtn.dataset.section || 'myProjects';
  const date = submitBtn.dataset.date || 'today';
  const defaultCat = submitBtn.dataset.defaultCat || '';

  // Get selected category from dropdown
  const catWrapper = form.querySelector('[data-action="selectCategory"]')?.closest('.category-select-wrapper');
  const selectedCat = catWrapper?.dataset.selectedCategory || defaultCat || '';

  // Get selected priority from dropdown
  const priWrapper = form.querySelector('[data-action="selectPriority"]')?.closest('.category-select-wrapper');
  const selectedPriority = priWrapper?.dataset.selectedPriority || 'default';

  const newTask = {
    id: uid('t'),
    text: text,
    completed: false,
    time: '',
    recurring: false,
    calendar: false,
    section: section,
    projectId: '',
    categoryId: selectedCat,
    priority: selectedPriority,
    date: date
  };

  appData.tasks.push(newTask);
  saveData();
  renderAll();
}

// ── View Switching ──────────────────────────

function switchView(view) {
  appData.currentView = view;
  saveData();

  // Update nav active states
  document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });
  // Update category active states
  document.querySelectorAll('.category-item').forEach(item => {
    item.classList.toggle('active', 'category-' + item.dataset.category === view);
  });

  renderMainContent();
}

// ── Sidebar Section Toggle ──────────────────

function initSidebarToggles() {
  document.querySelectorAll('.sidebar-section .section-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.section-add-btn')) return;
      const items = header.nextElementSibling;
      if (items) {
        items.classList.toggle('collapsed');
        header.classList.toggle('collapsed');
      }
    });
  });
}

// ── Navigation ──────────────────────────────

function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      switchView(view);
    });
  });
}

// ── Search ──────────────────────────────────

function initSearch() {
  const searchBtn = $('navSearch');
  const searchOverlay = $('searchOverlay');
  const searchInput = $('searchInput');
  const searchResults = $('searchResults');

  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('open');
      searchInput.value = '';
      searchResults.innerHTML = '<div class="search-no-results">Type to search your tasks</div>';
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '<div class="search-no-results">Type to search your tasks</div>';
      return;
    }

    const results = appData.tasks.filter(t =>
      t.text.toLowerCase().includes(query) && !t.completed
    );

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No tasks found</div>';
      return;
    }

    searchResults.innerHTML = results.map(t => {
      const cat = getCategoryById(t.categoryId);
      return `
        <div class="search-result-item" data-task-id="${t.id}">
          <div class="task-checkbox ${t.priority && t.priority !== 'default' ? 'priority-' + t.priority : ''}" style="width:16px;height:16px;min-width:16px;">
            <svg viewBox="0 0 12 12" fill="none" style="width:8px;height:8px;">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span style="flex:1;font-size:14px;">${esc(t.text)}</span>
          ${cat ? `<span class="task-category-badge" style="background:${cat.color};font-size:10px;padding:1px 6px;">${esc(cat.name)}</span>` : ''}
        </div>`;
    }).join('');
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchOverlay.classList.remove('open');
      searchInput.value = '';
    }
  });
}

// ── Add Task from Sidebar ───────────────────

function initSidebarAddTask() {
  $('sidebarAddTaskBtn').addEventListener('click', () => {
    // Ensure we're on a view that has an add form, default to today
    if (!appData.currentView.startsWith('category-') && appData.currentView !== 'today' && appData.currentView !== 'inbox') {
      switchView('today');
    }
    // Try to open the first add task form
    setTimeout(() => {
      const firstAddBtn = document.querySelector('.add-task-inline');
      if (firstAddBtn) firstAddBtn.click();
    }, 50);
  });
}

// ── Category Modal ──────────────────────────

let selectedColor = CATEGORY_COLORS[0];
let editingCategoryId = null;
let editSelectedColor = CATEGORY_COLORS[0];

function initCategoryModal() {
  // Open modal
  $('addCategoryTrigger').addEventListener('click', (e) => {
    e.stopPropagation();
    openAddCategoryModal();
  });

  // Close modal
  $('closeCategoryModal').addEventListener('click', closeAddCategoryModal);
  $('cancelCategoryBtn').addEventListener('click', closeAddCategoryModal);
  $('addCategoryModal').addEventListener('click', (e) => {
    if (e.target === $('addCategoryModal')) closeAddCategoryModal();
  });

  // Name input
  $('categoryNameInput').addEventListener('input', () => {
    $('saveCategoryBtn').disabled = !$('categoryNameInput').value.trim();
  });
  $('categoryNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && $('categoryNameInput').value.trim()) {
      saveNewCategory();
    }
    if (e.key === 'Escape') closeAddCategoryModal();
  });

  // Save
  $('saveCategoryBtn').addEventListener('click', saveNewCategory);

  // Edit modal
  $('closeEditCategoryModal').addEventListener('click', closeEditCategoryModal);
  $('cancelEditCategoryBtn').addEventListener('click', closeEditCategoryModal);
  $('editCategoryModal').addEventListener('click', (e) => {
    if (e.target === $('editCategoryModal')) closeEditCategoryModal();
  });
  $('saveEditCategoryBtn').addEventListener('click', saveEditCategory);
  $('deleteCategoryBtn').addEventListener('click', deleteCategory);
  $('editCategoryNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEditCategory();
    if (e.key === 'Escape') closeEditCategoryModal();
  });
}

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
  closeAddCategoryModal();
  renderAll();
}

function openEditCategoryModal(catId) {
  const cat = getCategoryById(catId);
  if (!cat) return;

  editingCategoryId = catId;
  editSelectedColor = cat.color;
  $('editCategoryNameInput').value = cat.name;
  renderColorPicker('editColorPickerGrid', editSelectedColor, (color) => {
    editSelectedColor = color;
  });
  $('editCategoryModal').classList.add('open');
  setTimeout(() => $('editCategoryNameInput').focus(), 100);
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
  cat.color = editSelectedColor;
  saveData();
  closeEditCategoryModal();
  renderAll();
}

function deleteCategory() {
  if (!editingCategoryId) return;
  // Remove category from tasks
  appData.tasks.forEach(t => {
    if (t.categoryId === editingCategoryId) {
      t.categoryId = '';
    }
  });
  appData.categories = appData.categories.filter(c => c.id !== editingCategoryId);

  // If viewing this category, switch to today
  if (appData.currentView === 'category-' + editingCategoryId) {
    appData.currentView = 'today';
  }

  saveData();
  closeEditCategoryModal();
  renderAll();
}

function renderColorPicker(containerId, selected, onSelect) {
  const container = $(containerId);
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

// ── Category Context Menu ───────────────────

function showCategoryContextMenu(e, catId) {
  e.preventDefault();
  e.stopPropagation();

  const menu = $('contextMenu');
  menu.innerHTML = `
    <button class="context-menu-item" data-action="editCat" data-cat-id="${catId}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Edit category
    </button>
    <div class="context-menu-divider"></div>
    <button class="context-menu-item danger" data-action="deleteCat" data-cat-id="${catId}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Delete category
    </button>`;

  // Position menu
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  menu.classList.add('open');

  // Ensure menu doesn't go off screen
  requestAnimationFrame(() => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = (window.innerWidth - rect.width - 8) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = (window.innerHeight - rect.height - 8) + 'px';
    }
  });

  // Handlers
  menu.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const id = item.dataset.catId;
      menu.classList.remove('open');

      if (action === 'editCat') {
        openEditCategoryModal(id);
      } else if (action === 'deleteCat') {
        editingCategoryId = id;
        deleteCategory();
      }
    });
  });
}

// ── Global Click (close dropdowns/menus) ────

function initGlobalClicks() {
  document.addEventListener('click', (e) => {
    // Close context menu
    const menu = $('contextMenu');
    if (menu && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }

    // Close dropdowns
    if (!e.target.closest('.category-select-wrapper')) {
      document.querySelectorAll('.category-select-dropdown.open, .priority-select-dropdown.open').forEach(d => {
        d.classList.remove('open');
      });
    }
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd+K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      $('navSearch').click();
    }
  });
}

// ── Render All ──────────────────────────────

function renderAll() {
  renderSidebarCategories();
  renderMainContent();
  updateNavCounts();
  renderMobileBody();
}

function updateNavCounts() {
  // We update category counts via renderSidebarCategories
}

// ============================================
// MOBILE APPLICATION LOGIC
// ============================================

let mobileState = {
  activeTab: 'tasks',       // 'tasks', 'calendar', 'categories', 'more'
  activeDatePill: 'tomorrow', // 'today', 'tomorrow', 'upcoming'
  calendarDay: 6            // default active day matching reference
};

function initDeviceSwitcher() {
  const btnDesktop = $('btnDesktopMode');
  const btnMobile = $('btnMobileMode');

  if (btnDesktop) {
    btnDesktop.addEventListener('click', () => {
      document.body.classList.remove('mobile-mode');
      btnDesktop.classList.add('active');
      if (btnMobile) btnMobile.classList.remove('active');
      renderAll();
    });
  }

  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      document.body.classList.add('mobile-mode');
      btnMobile.classList.add('active');
      if (btnDesktop) btnDesktop.classList.remove('active');
      renderMobileBody();
      renderMobileDrawer();
    });
  }
}

function updateMobileClock() {
  const statusTime = $('statusTime');
  if (!statusTime) return;
  const now = new Date();
  let hours = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  statusTime.textContent = `${hours}:${mins}`;
}

function initMobileApp() {
  initDeviceSwitcher();
  updateMobileClock();
  setInterval(updateMobileClock, 30000);

  // Drawer events
  const drawerBtn = $('mobileDrawerBtn');
  const closeDrawerBtn = $('closeMobileDrawer');
  const drawerOverlay = $('mobileDrawerOverlay');

  if (drawerBtn) {
    drawerBtn.addEventListener('click', () => {
      renderMobileDrawer();
      drawerOverlay.classList.add('open');
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      drawerOverlay.classList.remove('open');
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) drawerOverlay.classList.remove('open');
    });
  }

  // Bottom nav tabs
  const tabTasks = $('mobileTabTasks');
  const tabCalendar = $('mobileTabCalendar');
  const tabCategories = $('mobileTabCategories');
  const tabMore = $('mobileTabMore');

  const tabs = [tabTasks, tabCalendar, tabCategories, tabMore];

  function setMobileTab(tabName) {
    mobileState.activeTab = tabName;
    tabs.forEach(t => {
      if (t) t.classList.toggle('active', t.dataset.tab === tabName);
    });
    renderMobileBody();
  }

  if (tabTasks) tabTasks.addEventListener('click', () => setMobileTab('tasks'));
  if (tabCalendar) tabCalendar.addEventListener('click', () => setMobileTab('calendar'));
  if (tabCategories) tabCategories.addEventListener('click', () => setMobileTab('categories'));
  if (tabMore) tabMore.addEventListener('click', () => setMobileTab('more'));

  // Mobile search
  const mobileSearchBtn = $('mobileSearchBtn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      $('navSearch').click();
    });
  }

  // FAB button
  const mobileFab = $('mobileFab');
  const sheetOverlay = $('mobileBottomSheetOverlay');
  if (mobileFab) {
    mobileFab.addEventListener('click', () => {
      openMobileBottomSheet();
    });
  }

  if (sheetOverlay) {
    sheetOverlay.addEventListener('click', (e) => {
      if (e.target === sheetOverlay) closeMobileBottomSheet();
    });
  }

  // Bottom sheet interactions
  initMobileBottomSheet();
}

function openMobileBottomSheet() {
  const sheetOverlay = $('mobileBottomSheetOverlay');
  const input = $('sheetTaskInput');
  const select = $('sheetCategorySelect');

  // Populate category select
  if (select) {
    let optionsHtml = '';
    optionsHtml += '<optgroup label="Categories">';
    appData.categories.forEach(c => {
      const selected = (appData.currentView === 'category-' + c.id) ? ' selected' : '';
      optionsHtml += `<option value="cat:${c.id}"${selected}>@ ${esc(c.name)}</option>`;
    });
    optionsHtml += '</optgroup>';
    optionsHtml += '<optgroup label="Projects">';
    appData.projects.forEach(p => {
      optionsHtml += `<option value="proj:${p.id}"># ${esc(p.name)}</option>`;
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
  const catSelect = $('sheetCategorySelect');

  const dates = ['Today', 'Tomorrow', 'Next 7 Days'];
  let dateIndex = 1; // Default Tomorrow matching reference

  if (datePill) {
    datePill.addEventListener('click', () => {
      dateIndex = (dateIndex + 1) % dates.length;
      const dName = dates[dateIndex];
      datePillText.textContent = dName;
      if (chipDate) chipDate.textContent = dName.toLowerCase();
    });
  }

  if (chipDate) {
    chipDate.addEventListener('click', () => {
      if (datePill) datePill.click();
    });
  }

  function submitMobileTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    let targetDate = 'tomorrow';
    if (dates[dateIndex] === 'Today') targetDate = 'today';
    else if (dates[dateIndex] === 'Next 7 Days') targetDate = 'upcoming';

    let catId = appData.categories[0].id;
    let projId = '';
    let section = 'myProjects';

    if (catSelect && catSelect.value) {
      const parts = catSelect.value.split(':');
      if (parts[0] === 'cat') {
        catId = parts[1];
      } else if (parts[0] === 'proj') {
        projId = parts[1];
        const proj = getProjectById(projId);
        if (proj) section = proj.section;
      }
    }

    const newTask = {
      id: uid('t'),
      text: text,
      completed: false,
      time: '',
      recurring: false,
      calendar: false,
      section: section,
      projectId: projId,
      categoryId: catId,
      priority: 'default',
      date: targetDate
    };

    appData.tasks.push(newTask);
    saveData();
    closeMobileBottomSheet();
    renderAll();
    renderMobileBody();
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', submitMobileTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitMobileTask();
    });
  }
}

function renderMobileDrawer() {
  const container = $('mobileDrawerNav');
  if (!container) return;

  let html = `
    <div class="sidebar-nav" style="padding:0 0 8px 0;">
      <button class="nav-item${appData.currentView === 'inbox' ? ' active' : ''}" data-mobile-view="inbox">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12H16L14 15H10L8 12H2" stroke="#246FE0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.45 5.11L2 12V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V12L18.55 5.11C18.21 4.43 17.52 4 16.76 4H7.24C6.48 4 5.79 4.43 5.45 5.11Z" stroke="#246FE0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="nav-label">Inbox</span>
      </button>
      <button class="nav-item${appData.currentView === 'today' ? ' active' : ''}" data-mobile-view="today">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#DC4C3E" stroke-width="1.5"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#DC4C3E" stroke-width="1.5" stroke-linecap="round"/>
          <text x="12" y="19" text-anchor="middle" font-size="8" font-weight="700" fill="#DC4C3E">21</text>
        </svg>
        <span class="nav-label">Today</span>
      </button>
      <button class="nav-item${appData.currentView === 'upcoming' ? ' active' : ''}" data-mobile-view="upcoming">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#692FC2" stroke-width="1.5"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#692FC2" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="nav-label">Upcoming</span>
      </button>
    </div>

    <!-- Categories Section -->
    <div class="sidebar-section" style="padding:4px 0;">
      <div class="section-header" style="cursor:default;">
        <div class="section-header-left">
          <div class="section-badge-categories">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="4.5" cy="4.5" r="2.5" fill="#246FE0"/>
              <circle cx="11.5" cy="4.5" r="2.5" fill="#DC4C3E"/>
              <circle cx="4.5" cy="11.5" r="2.5" fill="#058527"/>
              <circle cx="11.5" cy="11.5" r="2.5" fill="#FF9A14"/>
            </svg>
          </div>
          <span class="section-title">Categories</span>
        </div>
      </div>
      <div class="section-items">
        ${appData.categories.map(c => `
          <button class="nav-item category-item${appData.currentView === 'category-' + c.id ? ' active' : ''}" data-mobile-view="category-${c.id}">
            <span class="category-dot" style="background:${c.color}"></span>
            <span class="nav-label">${esc(c.name)}</span>
            <span class="nav-count">${getTaskCountForCategory(c.id)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- My Projects Section -->
    <div class="sidebar-section" style="padding:4px 0;">
      <div class="section-header" style="cursor:default;">
        <div class="section-header-left">
          <div class="section-badge-avatar">
            <img src="avatar.jpg" alt="Denise" class="section-avatar-img">
          </div>
          <span class="section-title">My Projects</span>
        </div>
      </div>
      <div class="section-items">
        <button class="nav-item project-item" data-mobile-view="today">
          <span class="project-icon hash" style="color: #058527">#</span>
          <span class="nav-label">Fitness</span>
        </button>
        <button class="nav-item project-item" data-mobile-view="today">
          <span class="project-icon hash" style="color: #FF9A14">#</span>
          <span class="nav-label">Groceries</span>
        </button>
        <button class="nav-item project-item" data-mobile-view="today">
          <span class="project-icon hash" style="color: #AF38EB">#</span>
          <span class="nav-label">Appointments</span>
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('[data-mobile-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.mobileView;
      switchView(view);
      $('mobileDrawerOverlay').classList.remove('open');
      mobileState.activeTab = 'tasks';
      $('mobileTabTasks').classList.add('active');
      $('mobileTabCalendar').classList.remove('active');
      $('mobileTabCategories').classList.remove('active');
      $('mobileTabMore').classList.remove('active');
      renderMobileBody();
    });
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
    titleEl.textContent = 'Settings & More';
    renderMobileMoreView(container);
    return;
  }

  // Tasks Tab: renders current view
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
      <div class="mobile-cal-month">September</div>
      <div class="mobile-day-strip">
        <div class="day-pill" data-day="5"><span class="day-pill-letter">M</span><span class="day-pill-number">5</span></div>
        <div class="day-pill active" data-day="6"><span class="day-pill-letter">T</span><span class="day-pill-number">6</span></div>
        <div class="day-pill" data-day="7"><span class="day-pill-letter">W</span><span class="day-pill-number">7</span></div>
        <div class="day-pill" data-day="8"><span class="day-pill-letter">T</span><span class="day-pill-number">8</span></div>
        <div class="day-pill" data-day="9"><span class="day-pill-letter">F</span><span class="day-pill-number">9</span></div>
      </div>
    </div>

    <!-- Hourly schedule timeline matching Reference 2 phone mockup -->
    <div class="schedule-timeline">
      <div class="timeline-row">
        <span class="timeline-time">07:00</span>
        <div class="timeline-card" style="background:#FFE6EC; border-left:4px solid #FF8D85;">
          <span>Morning Run</span>
          <span class="timeline-card-sub" style="color:#B8255F;">07:00 - 08:00 · Health & Fitness</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">08:00</span>
        <div class="timeline-card" style="background:#EBF2FF; border-left:4px solid #246FE0;">
          <span>Shoot Video</span>
          <span class="timeline-card-sub" style="color:#246FE0;">08:00 - 12:00 · Work</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">09:00</span>
        <div class="timeline-card" style="background:#FFF6E6; border-left:4px solid #FF9A14;">
          <span>Go Grocery Shopping</span>
          <span class="timeline-card-sub" style="color:#EB8909;">09:00 - 11:00 · Shopping</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">12:00</span>
        <div class="timeline-card" style="background:#E6F9EC; border-left:4px solid #058527;">
          <span>Reply to Emails</span>
          <span class="timeline-card-sub" style="color:#058527;">12:00 - 13:00 · Work</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">13:00</span>
        <div class="timeline-card" style="background:#EBF2FF; border-left:4px solid #246FE0;">
          <span>Discuss Plan with Client</span>
          <span class="timeline-card-sub" style="color:#246FE0;">13:00 - 14:00 · Work</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">14:00</span>
        <div class="timeline-card" style="background:#F2EAFF; border-left:4px solid #AF38EB;">
          <span>Host Project Meeting</span>
          <span class="timeline-card-sub" style="color:#692FC2;">14:00 - 15:30 · Work</span>
        </div>
      </div>

      <div class="timeline-row">
        <span class="timeline-time">17:30</span>
        <div class="timeline-card" style="background:#FFF0E6; border-left:4px solid #EB8909;">
          <span>Finalize Promo Video</span>
          <span class="timeline-card-sub" style="color:#EB8909;">17:30 - 18:30 · Work</span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.day-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

function renderMobileCategoriesHub(container) {
  let html = `
    <div style="margin-bottom:12px; font-size:13px; color:#666;">
      Select a category to view and organize things to do next:
    </div>
    <div class="mobile-categories-hub">
      ${appData.categories.map(c => {
        const count = getTaskCountForCategory(c.id);
        return `
          <div class="mobile-cat-card" data-cat-id="${c.id}">
            <div class="mobile-cat-info">
              <span class="mobile-cat-dot" style="background:${c.color}"></span>
              <span class="mobile-cat-title">${esc(c.name)}</span>
            </div>
            <span class="mobile-cat-count">${count} tasks</span>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top:16px;">
      <button class="add-task-inline" id="mobileAddCategoryTrigger" style="justify-content:center; border:1px dashed #DDD; border-radius:10px; padding:10px;">
        <span class="add-task-plus">+</span>
        <span>Add new category</span>
      </button>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.mobile-cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.catId;
      switchView('category-' + catId);
      mobileState.activeTab = 'tasks';
      $('mobileTabTasks').classList.add('active');
      $('mobileTabCategories').classList.remove('active');
      renderMobileBody();
    });
  });

  const addCatBtn = $('mobileAddCategoryTrigger');
  if (addCatBtn) {
    addCatBtn.addEventListener('click', () => {
      openAddCategoryModal();
    });
  }
}

function renderMobileMoreView(container) {
  container.innerHTML = `
    <div style="padding:10px 0;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #EEE;">
        <div class="user-avatar" style="width:48px;height:48px;">
          <img src="avatar.jpg" alt="Denise" class="user-avatar-img">
        </div>
        <div>
          <div style="font-size:16px;font-weight:700;">Denise</div>
          <div style="font-size:12px;color:#888;">denise@todoist.com</div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="nav-item" id="mobileSwitchDesktopBtn" style="padding:12px; background:#F5F5F5; border-radius:10px; font-weight:600;">
          <span>💻 Switch to Desktop View</span>
        </button>
        <button class="nav-item" id="mobileResetDataBtn" style="padding:12px; background:#FFF5F5; color:#DC4C3E; border-radius:10px; font-weight:600;">
          <span>🔄 Reset to Sample Data</span>
        </button>
      </div>
    </div>
  `;

  const switchDesktopBtn = $('mobileSwitchDesktopBtn');
  if (switchDesktopBtn) {
    switchDesktopBtn.addEventListener('click', () => {
      document.body.classList.remove('mobile-mode');
      const btnDesktop = $('btnDesktopMode');
      const btnMobile = $('btnMobileMode');
      if (btnDesktop) btnDesktop.classList.add('active');
      if (btnMobile) btnMobile.classList.remove('active');
      renderAll();
    });
  }

  const resetDataBtn = $('mobileResetDataBtn');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
      renderAll();
      renderMobileBody();
      alert('Sample data reset!');
    });
  }
}

// ── Initialize ──────────────────────────────

function init() {
  loadData();
  initNavigation();
  initSidebarToggles();
  initSearch();
  initSidebarAddTask();
  initCategoryModal();
  initGlobalClicks();
  initMobileApp();

  // Set active nav
  document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(item => {
    item.classList.toggle('active', item.dataset.view === appData.currentView);
  });

  renderAll();
}

// Make showCategoryContextMenu available globally
window.showCategoryContextMenu = showCategoryContextMenu;

// Start
document.addEventListener('DOMContentLoaded', init);

