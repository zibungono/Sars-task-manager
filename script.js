const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const dateGroups = document.getElementById('dateGroups');
const taskSummary = document.getElementById('taskSummary');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const todayAlert = document.getElementById('todayAlert');
const sampleTasksBtn = document.getElementById('sampleTasksBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');

let tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

function saveTasks() {
  localStorage.setItem('dailyTasks', JSON.stringify(tasks));
}

function addTask(title, dueDate) {
  tasks.push({
    id: Date.now() + Math.random(),
    title,
    dueDate,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function getDateStatus(dueDate) {
  const today = getTodayString();

  if (dueDate === today) return { text: 'Due today', className: 'today' };
  if (dueDate < today) return { text: 'Overdue', className: 'overdue' };
  return { text: 'Upcoming', className: 'upcoming' };
}

function updateTodayProgress() {
  const today = getTodayString();
  const todayTasks = tasks.filter(task => task.dueDate === today);
  const completedToday = todayTasks.filter(task => task.completed).length;
  const percentage = todayTasks.length === 0 ? 0 : Math.round((completedToday / todayTasks.length) * 100);

  taskSummary.textContent = todayTasks.length === 0
    ? 'No tasks due today'
    : `${completedToday} of ${todayTasks.length} tasks due today complete`;

  progressBar.style.width = `${percentage}%`;
  progressPercent.textContent = `${percentage}%`;

  const openTodayTasks = todayTasks.filter(task => !task.completed).length;
  if (openTodayTasks > 0) {
    todayAlert.classList.add('show');
    todayAlert.textContent = `Alert: ${openTodayTasks} task${openTodayTasks === 1 ? '' : 's'} due today need${openTodayTasks === 1 ? 's' : ''} your attention.`;
  } else {
    todayAlert.classList.remove('show');
    todayAlert.textContent = '';
  }
}

function groupTasksByDate() {
  return tasks
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title))
    .reduce((groups, task) => {
      if (!groups[task.dueDate]) groups[task.dueDate] = [];
      groups[task.dueDate].push(task);
      return groups;
    }, {});
}

function renderTasks() {
  dateGroups.innerHTML = '';

  if (tasks.length === 0) {
    dateGroups.innerHTML = '<div class="empty-state">Add your first task or populate demo tasks to start tracking progress.</div>';
    updateTodayProgress();
    return;
  }

  const groups = groupTasksByDate();

  Object.entries(groups).forEach(([dueDate, groupedTasks]) => {
    const status = getDateStatus(dueDate);
    const completedCount = groupedTasks.filter(task => task.completed).length;

    const group = document.createElement('section');
    group.className = 'date-group';
    group.innerHTML = `
      <div class="date-group-header">
        <h3>${formatDate(dueDate)}</h3>
        <span class="date-status ${status.className}">${status.text} · ${completedCount}/${groupedTasks.length} complete</span>
      </div>
      <ul class="task-list"></ul>
    `;

    const list = group.querySelector('.task-list');

    groupedTasks.forEach(task => {
      const taskStatus = getDateStatus(task.dueDate);
      const listItem = document.createElement('li');
      listItem.className = `task-item ${task.completed ? 'completed' : ''}`;

      listItem.innerHTML = `
        <label>
          <input type="checkbox" ${task.completed ? 'checked' : ''} />
          <span>
            <strong class="task-title"></strong>
            <span class="task-meta">Due ${formatDate(task.dueDate)}</span>
          </span>
        </label>
        <span class="task-badge ${taskStatus.className}">${taskStatus.text}</span>
      `;

      listItem.querySelector('.task-title').textContent = task.title;
      listItem.querySelector('input').addEventListener('change', () => toggleTask(task.id));
      list.appendChild(listItem);
    });

    dateGroups.appendChild(group);
  });

  updateTodayProgress();
}

function populateDemoTasks() {
  tasks = [
    { id: Date.now() + 1, title: 'Prepare interview talking points', dueDate: addDays(0), completed: false },
    { id: Date.now() + 2, title: 'Review task manager case study', dueDate: addDays(0), completed: true },
    { id: Date.now() + 3, title: 'Send GitHub repository link', dueDate: addDays(0), completed: false },
    { id: Date.now() + 4, title: 'Create project README notes', dueDate: addDays(1), completed: false },
    { id: Date.now() + 5, title: 'Refine mobile layout', dueDate: addDays(2), completed: false },
    { id: Date.now() + 6, title: 'Test browser storage', dueDate: addDays(3), completed: false },
    { id: Date.now() + 7, title: 'Prepare demo walkthrough', dueDate: addDays(4), completed: false }
  ];
  saveTasks();
  renderTasks();
}

function clearTasks() {
  const confirmed = window.confirm('Clear all tasks and reset the demo?');
  if (!confirmed) return;

  tasks = [];
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!title || !dueDate) return;

  addTask(title, dueDate);
  taskInput.value = '';
  dueDateInput.value = getTodayString();
  taskInput.focus();
});

sampleTasksBtn.addEventListener('click', populateDemoTasks);
clearTasksBtn.addEventListener('click', clearTasks);

dueDateInput.value = getTodayString();
renderTasks();
