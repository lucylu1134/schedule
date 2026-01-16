/* =========================================================
   TRACKER (Menu/Groceries/Workout/Weight) INIT
   Expects a global WEEKS object from ./weeks/weeks.js
========================================================= */

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const sections = {
    menu: $("menu"),
    grocery: $("grocery"),
    workout: $("workout"),
    progress: $("progress"),
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      Object.keys(sections).forEach(key => {
        if (sections[key]) sections[key].style.display = (key === target ? "block" : "none");
      });
    });
  });
}

function initWeekSelect() {
  const select = $("weekSelect");
  if (!select) return;

  // WEEKS should be defined in weeks/weeks.js
  if (typeof WEEKS === "undefined") {
    console.error("WEEKS is not defined. Check that ./weeks/weeks.js loads and defines WEEKS.");
    return;
  }

  select.innerHTML = "";

  Object.keys(WEEKS).forEach(weekKey => {
    const opt = document.createElement("option");
    opt.value = weekKey;
    opt.textContent = WEEKS[weekKey].title || weekKey;
    select.appendChild(opt);
  });

  // default to first week
  const firstKey = Object.keys(WEEKS)[0];
  if (firstKey) {
    select.value = firstKey;
    renderWeek(firstKey);
  }

  select.addEventListener("change", () => renderWeek(select.value));
}

function renderWeek(weekKey) {
  const week = WEEKS[weekKey];
  if (!week) return;

  if ($("weekTitle")) $("weekTitle").textContent = week.title || weekKey;

  // Menu
  const menuEl = $("menuContent");
  if (menuEl) {
    menuEl.innerHTML = week.menuHTML || "<div class='small'>No menu data found for this week.</div>";
  }

  // Groceries
  const gEl = $("groceryContent");
  if (gEl) {
    gEl.innerHTML = week.groceryHTML || "<div class='small'>No grocery data found for this week.</div>";
  }

  // Workout (optional)
  const wEl = $("workoutContent");
  if (wEl && week.workoutHTML) {
    wEl.innerHTML = week.workoutHTML;
  }
}

/* ---- Weight tracker (basic localStorage) ---- */
function initWeightTracker() {
  const dateInput = $("dateInput");
  const weightInput = $("weightInput");
  const addBtn = $("addBtn");
  const tableBody = document.querySelector("#weightTable tbody");
  const canvas = $("weightChart");

  if (!dateInput || !weightInput || !addBtn || !tableBody || !canvas) return;

  let data = JSON.parse(localStorage.getItem("lucy_weight_data") || "[]");

  function save() {
    localStorage.setItem("lucy_weight_data", JSON.stringify(data));
  }

  function renderTable() {
    tableBody.innerHTML = "";
    const sorted = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${e.date}</td><td>${Number(e.weight).toFixed(1)}</td>`;
      tableBody.appendChild(tr);
    });
  }

  let chart = null;
  function renderChart() {
    const sorted = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(e => e.date);
    const values = sorted.map(e => e.weight);

    if (chart) chart.destroy();
    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{ label: "Weight (kg)", data: values, tension: 0.2, pointRadius: 3 }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  addBtn.addEventListener("click", () => {
    const d = dateInput.value;
    const w = parseFloat(weightInput.value);
    if (!d || isNaN(w)) return;

    const idx = data.findIndex(x => x.date === d);
    if (idx >= 0) data[idx].weight = w;
    else data.push({ date: d, weight: w });

    save();
    renderTable();
    renderChart();
    weightInput.value = "";
  });

  // default date = today
  dateInput.value = todayISO();

  if (data.length) {
    renderTable();
    renderChart();
  }
}

function initTracker() {
  initTabs();
  initWeekSelect();
  initWeightTracker();
}

/* =========================================================
   Utilities
========================================================= */
function $(id) { return document.getElementById(id); }

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfWeekISO(iso) {
  return new Date(iso + "T00:00:00").getDay(); // 0 Sun ... 6 Sat
}

function weekNumberISO(iso) {
  const d = new Date(iso + "T00:00:00");
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function daysUntil(dueISO, fromISO = todayISO()) {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(dueISO + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

function dueLabel(dueISO) {
  const d = daysUntil(dueISO);
  if (d > 1) return { text: `Due in ${d} days`, overdue: false };
  if (d === 1) return { text: "Due tomorrow", overdue: false };
  if (d === 0) return { text: "Due today", overdue: false };
  return { text: `Overdue by ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"}`, overdue: true };
}

/* =========================================================
   Storage
========================================================= */
function loadUserTasks() {
  return JSON.parse(localStorage.getItem("lucy_user_tasks") || "[]");
}
function saveUserTasks(tasks) {
  localStorage.setItem("lucy_user_tasks", JSON.stringify(tasks));
}

function loadDueTasks() {
  return JSON.parse(localStorage.getItem("lucy_due_tasks") || "[]");
}
function saveDueTasks(tasks) {
  localStorage.setItem("lucy_due_tasks", JSON.stringify(tasks));
}

function loadTaskState(iso = todayISO()) {
  return JSON.parse(localStorage.getItem("lucy_task_state_" + iso) || "{}");
}
function saveTaskState(state, iso = todayISO()) {
  localStorage.setItem("lucy_task_state_" + iso, JSON.stringify(state));
}

function loadDailyCompleteDays() {
  return JSON.parse(localStorage.getItem("lucy_daily_complete_days") || "[]");
}
function saveDailyCompleteDays(days) {
  localStorage.setItem("lucy_daily_complete_days", JSON.stringify(days));
}

/* =========================================================
   Default tasks
========================================================= */
function getDefaultTasksForDate(iso) {
  const day = dayOfWeekISO(iso);
  const week = weekNumberISO(iso);

  const tasks = [];

  // Daily defaults
  tasks.push({ id: "gym", text: "Gym / Cardio", source: "default", enabled: [1,2,3,4].includes(day) }); // Mon-Thu only
  tasks.push({ id: "weight", text: "Record weight", source: "default", enabled: true });
  tasks.push({ id: "shower", text: "Shower", source: "default", enabled: true });

  // Weekly defaults
  tasks.push({ id: "laundry", text: "Laundry", source: "weekly", enabled: true });
  tasks.push({ id: "groceries", text: "Groceries", source: "weekly", enabled: true });
  tasks.push({ id: "journal", text: "Journal", source: "weekly", enabled: true });

  // Biweekly (even weeks)
  if (week % 2 === 0) {
    tasks.push({ id: "bedsheets", text: "Change bedsheets", source: "biweekly", enabled: true });
  }

  // Filter out disabled (e.g. gym on Fri-Sun)
  return tasks.filter(t => t.enabled);
}

/* =========================================================
   Celebration + streak
========================================================= */
function wasDailyComplete(iso) {
  return loadDailyCompleteDays().includes(iso);
}

function markDailyComplete(iso) {
  const days = new Set(loadDailyCompleteDays());
  days.add(iso);
  saveDailyCompleteDays([...days]);
}

function computeStreak() {
  let streak = 0;
  let iso = todayISO();
  while (wasDailyComplete(iso)) {
    streak++;
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() - 1);
    iso = d.toISOString().slice(0, 10);
  }
  return streak;
}

function popConfetti() {
  const layer = $("confettiLayer");
  if (!layer) return;

  layer.innerHTML = "";
  layer.style.display = "block";

  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = `hsl(${Math.random()*360},80%,60%)`;
    el.style.animationDuration = 700 + Math.random() * 600 + "ms";
    layer.appendChild(el);
  }

  setTimeout(() => {
    layer.style.display = "none";
    layer.innerHTML = "";
  }, 1200);
}

/* =========================================================
   Homework / due tasks
========================================================= */
function addDueTask(text, dueDateISO) {
  const tasks = loadDueTasks();
  tasks.push({ id: "due_" + Date.now(), text, dueDate: dueDateISO });
  saveDueTasks(tasks);
  renderChecklist();
}

/* =========================================================
   User tasks (manual, no due date)
========================================================= */
function addUserTask(text) {
  const tasks = loadUserTasks();
  tasks.push({ id: "user_" + Date.now(), text, source: "user" });
  saveUserTasks(tasks);
  renderChecklist();
}

/* =========================================================
   Checklist render (single list)
========================================================= */
function renderChecklist() {
  const iso = todayISO();
  const listEl = $("checklistList");
  if (!listEl) return;

  listEl.innerHTML = "";

  const defaults = getDefaultTasksForDate(iso);

  const dueTasks = loadDueTasks().map(t => ({
    id: t.id,
    text: t.text,
    source: "due",
    dueDate: t.dueDate
  }));

  const userTasks = loadUserTasks().map(t => ({
    id: t.id,
    text: t.text,
    source: "user"
  }));

  const allTasks = [...defaults, ...dueTasks, ...userTasks];
  const state = loadTaskState(iso);

  let defaultsComplete = true;

  allTasks.forEach(task => {
    const row = document.createElement("div");
    row.className = "task-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state[task.id];

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = "task-text";
    if (cb.checked) text.classList.add("checked");

    let meta = null;
    if (task.source === "due" && task.dueDate) {
      const info = dueLabel(task.dueDate);
      meta = document.createElement("span");
      meta.className = "task-meta" + (info.overdue ? " overdue" : "");
      meta.textContent = `(${info.text})`;
    }

    cb.addEventListener("change", () => {
      const st = loadTaskState(iso);

      if (cb.checked) {
        st[task.id] = true;
        text.classList.add("checked");

        // checked user tasks disappear
        if (task.source === "user") {
          saveUserTasks(loadUserTasks().filter(t => t.id !== task.id));
        }

        // checked due tasks disappear
        if (task.source === "due") {
          saveDueTasks(loadDueTasks().filter(t => t.id !== task.id));
        }
      } else {
        // unchecking keeps task (unless you later check it)
        delete st[task.id];
        text.classList.remove("checked");
      }

      saveTaskState(st, iso);
      renderChecklist();
    });

    row.appendChild(cb);
    row.appendChild(text);
    if (meta) row.appendChild(meta);
    listEl.appendChild(row);

    // Only default tasks count toward celebration
    if (task.source === "default" && !cb.checked) defaultsComplete = false;
  });

  if (defaultsComplete && !wasDailyComplete(iso)) {
    markDailyComplete(iso);
    popConfetti();
    const celebrate = $("dailyCelebrate");
    if (celebrate) {
      celebrate.style.display = "block";
      setTimeout(() => (celebrate.style.display = "none"), 1500);
    }
  }

  const streak = computeStreak();
  if ($("streakText")) $("streakText").textContent = `${streak} day streak`;
}

/* =========================================================
   Simple view routing (home/tracker/checklist)
========================================================= */
function showView(viewId) {
  const ids = ["homeView", "trackerView", "checklistView"];
  ids.forEach(id => {
    const el = $(id);
    if (el) el.style.display = (id === viewId ? "block" : "none");
  });
}

/* =========================================================
   Init
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Home navigation
  if ($("goTracker")) $("goTracker").addEventListener("click", () => showView("trackerView"));
  if ($("goChecklist")) $("goChecklist").addEventListener("click", () => showView("checklistView"));
  if ($("backFromTracker")) $("backFromTracker").addEventListener("click", () => showView("homeView"));
  if ($("backFromChecklist")) $("backFromChecklist").addEventListener("click", () => showView("homeView"));

  // Labels
  if ($("todayLabel")) $("todayLabel").textContent = "Today: " + todayISO();
  if ($("checklistDateLabel")) $("checklistDateLabel").textContent = "Today: " + todayISO();

  // Homework/projects inputs
  if ($("hwDueInput")) $("hwDueInput").value = todayISO();
  if ($("addHwBtn") && $("hwInput") && $("hwDueInput")) {
    $("addHwBtn").addEventListener("click", () => {
      const text = $("hwInput").value.trim();
      const due = $("hwDueInput").value;
      if (!text || !due) return;
      addDueTask(text, due);
      $("hwInput").value = "";
    });
  }

  // Manual checklist task input
  if ($("addTaskBtn") && $("newTaskInput")) {
    $("addTaskBtn").addEventListener("click", () => {
      const val = $("newTaskInput").value.trim();
      if (!val) return;
      addUserTask(val);
      $("newTaskInput").value = "";
    });
  }

  renderChecklist();
   initTracker();
});
