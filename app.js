// ---------------------------
// Utilities: dates + keys
// ---------------------------
function toISODateLocal(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDayOfWeek(d = new Date()) {
  // JS: 0=Sun..6=Sat, we’ll treat Mon..Thu for gym
  return d.getDay();
}

function weekStartISO(d = new Date()) {
  // Monday as week start
  const dt = new Date(d);
  const day = dt.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day); // move to Monday
  dt.setDate(dt.getDate() + diff);
  return toISODateLocal(dt);
}

function getWeekIndex(d = new Date()) {
  // simple week index based on weekStart date (stable for our purposes)
  const ws = new Date(weekStartISO(d) + "T00:00:00");
  const epoch = new Date("2025-01-06T00:00:00"); // a Monday
  const weeks = Math.floor((ws - epoch) / (7 * 24 * 3600 * 1000));
  return weeks;
}

// ---------------------------
// Navigation: Home / Tracker / Checklist
// ---------------------------
const homeView = document.getElementById('homeView');
const trackerView = document.getElementById('trackerView');
const checklistView = document.getElementById('checklistView');

document.getElementById('goTracker').addEventListener('click', () => {
  homeView.style.display = 'none';
  checklistView.style.display = 'none';
  trackerView.style.display = 'block';
});

document.getElementById('goChecklist').addEventListener('click', () => {
  homeView.style.display = 'none';
  trackerView.style.display = 'none';
  checklistView.style.display = 'block';
  renderChecklist(); // ensure fresh render when opened
});

document.getElementById('backFromTracker').addEventListener('click', () => {
  trackerView.style.display = 'none';
  checklistView.style.display = 'none';
  homeView.style.display = 'block';
});

document.getElementById('backFromChecklist').addEventListener('click', () => {
  checklistView.style.display = 'none';
  trackerView.style.display = 'none';
  homeView.style.display = 'block';
});

document.getElementById('todayLabel').textContent = `Today: ${toISODateLocal()}`;
document.getElementById('checklistDateLabel').textContent = `Today: ${toISODateLocal()}`;

// ---------------------------
// Tracker: tab switching
// ---------------------------
const tabs = document.querySelectorAll('.tab');
const sections = {
  menu: document.getElementById('menu'),
  grocery: document.getElementById('grocery'),
  workout: document.getElementById('workout'),
  progress: document.getElementById('progress'),
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    Object.keys(sections).forEach(key => {
      sections[key].style.display = key === target ? 'block' : 'none';
    });
  });
});

// ---------------------------
// Tracker: week menu + groceries (from data.js)
// ---------------------------
const weekSelect = document.getElementById('weekSelect');
const weekTitleEl = document.getElementById('weekTitle');
const menuContentEl = document.getElementById('menuContent');
const groceryContentEl = document.getElementById('groceryContent');

WEEKS.forEach(week => {
  const opt = document.createElement('option');
  opt.value = week.id;
  opt.textContent = week.label;
  weekSelect.appendChild(opt);
});

function renderWeek(weekId) {
  const week = WEEKS.find(w => w.id === weekId) || WEEKS[0];
  weekTitleEl.textContent = week.title;

  // Menu
  menuContentEl.innerHTML = "";
  week.menu.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block';

    let html = `<div class="day-name">${day.name}`;
    if (day.badge) html += ` <span class="badge">${day.badge}</span>`;
    html += `</div>`;

    day.meals.forEach(m => {
      html += `<div class="meal-title">${m.title}</div><div>${m.text}</div>`;
    });

    dayDiv.innerHTML = html;
    menuContentEl.appendChild(dayDiv);
  });

  // Groceries
  groceryContentEl.innerHTML = "";

  const storageKey = `lucy_grocery_${week.id}`;
  let groceryState = JSON.parse(localStorage.getItem(storageKey) || '{}');

  function sectionTitle(text) {
    const t = document.createElement('div');
    t.className = 'section-title';
    t.textContent = text;
    return t;
  }

  function addChecklist(items, titleText) {
    groceryContentEl.appendChild(sectionTitle(titleText));
    const ul = document.createElement('ul');
    ul.className = 'checklist';

    items.forEach(item => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.key = item.key;

      label.appendChild(cb);
      label.append(item.label);

      if (groceryState[item.key]) {
        cb.checked = true;
        label.classList.add('checked');
      }

      cb.addEventListener('change', () => {
        if (cb.checked) {
          groceryState[item.key] = true;
          label.classList.add('checked');
        } else {
          delete groceryState[item.key];
          label.classList.remove('checked');
        }
        localStorage.setItem(storageKey, JSON.stringify(groceryState));
      });

      li.appendChild(label);
      ul.appendChild(li);
    });

    groceryContentEl.appendChild(ul);
  }

  addChecklist(week.grocery.proteins, "Protein");
  addChecklist(week.grocery.veggies, "Veggies (Chinese names stay Chinese)");
  addChecklist(week.grocery.other, "Other");

  const note = document.createElement('p');
  note.className = 'small';
  note.textContent = "Tip: edit weekly menu + groceries in data.js. Grocery checkmarks are saved per week.";
  groceryContentEl.appendChild(note);
}

weekSelect.value = WEEKS[0].id;
renderWeek(weekSelect.value);
weekSelect.addEventListener('change', () => renderWeek(weekSelect.value));

// ---------------------------
// Tracker: weight chart
// ---------------------------
let weightData = JSON.parse(localStorage.getItem('lucy_weight_data') || '[]');

const dateInput = document.getElementById('dateInput');
const weightInput = document.getElementById('weightInput');
const addBtn = document.getElementById('addBtn');
const tableBody = document.querySelector('#weightTable tbody');
const ctx = document.getElementById('weightChart').getContext('2d');

function renderTable() {
  tableBody.innerHTML = '';
  const sorted = [...weightData].sort((a, b) => new Date(a.date) - new Date(b.date));
  sorted.forEach(entry => {
    const tr = document.createElement('tr');
    const d = document.createElement('td');
    const w = document.createElement('td');
    d.textContent = entry.date;
    w.textContent = entry.weight.toFixed(1);
    tr.appendChild(d);
    tr.appendChild(w);
    tableBody.appendChild(tr);
  });
}

let chart;
function renderChart() {
  const sorted = [...weightData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(e => e.date);
  const values = sorted.map(e => e.weight);
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Weight (kg)', data: values, tension: 0.2, pointRadius: 3 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function saveWeightData() {
  localStorage.setItem('lucy_weight_data', JSON.stringify(weightData));
}

addBtn.addEventListener('click', () => {
  const date = dateInput.value;
  const weight = parseFloat(weightInput.value);
  if (!date || isNaN(weight)) return;

  const idx = weightData.findIndex(e => e.date === date);
  if (idx >= 0) weightData[idx].weight = weight;
  else weightData.push({ date, weight });

  saveWeightData();
  renderTable();
  renderChart();
  weightInput.value = '';
});

if (weightData.length) {
  renderTable();
  renderChart();
}

// ---------------------------
// Checklist logic
// ---------------------------
const dailyDefaults = (d = new Date()) => {
  const day = getDayOfWeek(d); // 0 Sun..6 Sat
  const base = [
    { id: "weight", text: "Weight", type: "default" },
    { id: "shower", text: "Shower", type: "default" },
  ];

  // Gym default Mon–Thu (Mon=1, Tue=2, Wed=3, Thu=4)
  if ([1,2,3,4].includes(day)) {
    base.unshift({ id: "gym", text: "Gym", type: "default" });
  }
  return base;
};

const weeklyDefaults = [
  { id: "laundry", text: "Laundry", type: "default" },
  { id: "groceries", text: "Groceries", type: "default" },
  { id: "journal", text: "Journal", type: "default" },
];

const biweeklyDefaults = [
  { id: "bedsheets", text: "Bedsheets", type: "default" },
];

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function saveJSON(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

function renderTaskList(container, tasks, stateKey, celebrateEl) {
  container.innerHTML = "";

  // state: { done: {taskId:true}, custom: [{id,text}] }
  const state = loadJSON(stateKey, { done: {}, custom: [] });

  let allDefaultsDone = true;

  tasks.forEach(task => {
    const row = document.createElement('div');
    row.className = 'task-row';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!state.done[task.id];

    const text = document.createElement('div');
    text.className = 'task-text' + (cb.checked ? ' checked' : '');
    text.textContent = task.text;

    cb.addEventListener('change', () => {
      if (cb.checked) {
        state.done[task.id] = true;
        text.classList.add('checked');

        // If custom task: remove it after completion
        if (task.type === "custom") {
          state.custom = state.custom.filter(t => t.id !== task.id);
          delete state.done[task.id];
          saveJSON(stateKey, state);
          renderChecklist(); // re-render to make it disappear
          return;
        }
      } else {
        // Defaults can be unchecked; custom tasks generally disappear when checked so this is mostly for defaults
        delete state.done[task.id];
        text.classList.remove('checked');
      }

      saveJSON(stateKey, state);
      renderChecklist(); // refresh celebration state
    });

    row.appendChild(cb);
    row.appendChild(text);
    container.appendChild(row);

    if (task.type === "default" && !cb.checked) allDefaultsDone = false;
    if (task.type === "custom") {
      // custom tasks don’t count toward “finish the section” unless you want them to
      // leaving them out makes celebration feel more achievable and consistent
    }
  });

  // Celebration: only when all defaults are done
  celebrateEl.style.display = allDefaultsDone ? 'block' : 'none';
}

function renderChecklist() {
  const today = new Date();
  const todayISO = toISODateLocal(today);
  const ws = weekStartISO(today);
  const weekIdx = getWeekIndex(today);
  const biweeklyBucket = Math.floor(weekIdx / 2); // changes every 2 weeks

  // Keys
  const dailyKey = `lucy_checklist_day_${todayISO}`;
  const weeklyKey = `lucy_checklist_week_${ws}`;
  const biweeklyKey = `lucy_checklist_biweekly_${biweeklyBucket}`;

  // Daily tasks = defaults for today + any custom tasks for today
  const dailyState = loadJSON(dailyKey, { done: {}, custom: [] });
  const dailyTasks = [
    ...dailyDefaults(today),
    ...dailyState.custom.map(t => ({ ...t, type: "custom" })),
  ];

  // Weekly tasks = weekly defaults + weekly custom tasks
  const weeklyState = loadJSON(weeklyKey, { done: {}, custom: [] });
  const weeklyTasks = [
    ...weeklyDefaults,
    ...weeklyState.custom.map(t => ({ ...t, type: "custom" })),
  ];

  // Biweekly tasks = defaults only (you can later allow custom too if you want)
  const biweeklyState = loadJSON(biweeklyKey, { done: {}, custom: [] });
  const biweeklyTasks = [
    ...biweeklyDefaults,
    ...biweeklyState.custom.map(t => ({ ...t, type: "custom" })),
  ];

  document.getElementById('checklistDateLabel').textContent = `Today: ${todayISO}`;

  renderTaskList(
    document.getElementById('dailyList'),
    dailyTasks,
    dailyKey,
    document.getElementById('dailyCelebrate')
  );

  renderTaskList(
    document.getElementById('weeklyList'),
    weeklyTasks,
    weeklyKey,
    document.getElementById('weeklyCelebrate')
  );

  renderTaskList(
    document.getElementById('biweeklyList'),
    biweeklyTasks,
    biweeklyKey,
    document.getElementById('biweeklyCelebrate')
  );
}

// Add custom daily task
document.getElementById('addDailyTask').addEventListener('click', () => {
  const input = document.getElementById('dailyNewTask');
  const text = input.value.trim();
  if (!text) return;

  const todayISO = toISODateLocal();
  const dailyKey = `lucy_checklist_day_${todayISO}`;
  const state = loadJSON(dailyKey, { done: {}, custom: [] });

  const id = `c_${Date.now()}`;
  state.custom.push({ id, text });
  saveJSON(dailyKey, state);

  input.value = "";
  renderChecklist();
});

// Add custom weekly task
document.getElementById('addWeeklyTask').addEventListener('click', () => {
  const input = document.getElementById('weeklyNewTask');
  const text = input.value.trim();
  if (!text) return;

  const ws = weekStartISO(new Date());
  const weeklyKey = `lucy_checklist_week_${ws}`;
  const state = loadJSON(weeklyKey, { done: {}, custom: [] });

  const id = `c_${Date.now()}`;
  state.custom.push({ id, text });
  saveJSON(weeklyKey, state);

  input.value = "";
  renderChecklist();
});

// Initial checklist render (so it’s ready when you open it)
renderChecklist();
