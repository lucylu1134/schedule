/* =========================================================
   Lucy's Schedule — app.js (FULL)
   Works with:
     - weeks/week1.js, weeks/week2.js ... each registers into window.WEEK_REGISTRY
     - weeks/weeks.js builds window.WEEKS = [ ...sorted weeks... ]
   Provides:
     - Home ↔ Tracker ↔ Checklist navigation
     - Tracker: Tabs + Week selector + Menu + Groceries + Workout + Weight chart
     - Checklist: defaults (Gym Mon–Thu, Weight, Shower) + weekly + biweekly
     - Homework/Projects due-date tasks with countdown, persist until checked
     - Confetti + streak
========================================================= */

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

// ISO-ish week number (good enough for biweekly toggle)
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

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Small helper: robust array/object check
function isPlainObject(x) {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

/* =========================================================
   View routing (home / tracker / checklist)
========================================================= */
function showView(viewId) {
  const ids = ["homeView", "trackerView", "checklistView"];
  ids.forEach(id => {
    const el = $(id);
    if (el) el.style.display = (id === viewId ? "block" : "none");
  });
}

/* =========================================================
   STORAGE
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
   DEFAULT TASKS
========================================================= */
function getDefaultTasksForDate(iso) {
  const day = dayOfWeekISO(iso);
  const week = weekNumberISO(iso);

  const tasks = [];

  // Gym Mon–Thu only
  if ([1, 2, 3, 4].includes(day)) {
    tasks.push({ id: "gym", text: "Gym / Cardio", source: "default" });
  }

  // Daily
  tasks.push({ id: "weight", text: "Record weight", source: "default" });
  tasks.push({ id: "shower", text: "Shower", source: "default" });

  // Weekly
  tasks.push({ id: "laundry", text: "Laundry", source: "weekly" });
  tasks.push({ id: "groceries", text: "Groceries", source: "weekly" });
  tasks.push({ id: "journal", text: "Journal", source: "weekly" });

  // Biweekly (even weeks)
  if (week % 2 === 0) {
    tasks.push({ id: "bedsheets", text: "Change bedsheets", source: "biweekly" });
  }

  return tasks;
}

/* =========================================================
   STREAK + CONFETTI
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
    el.style.background = `hsl(${Math.random() * 360},80%,60%)`;
    el.style.animationDuration = 700 + Math.random() * 600 + "ms";
    layer.appendChild(el);
  }

  setTimeout(() => {
    layer.style.display = "none";
    layer.innerHTML = "";
  }, 1200);
}

/* =========================================================
   CHECKLIST
========================================================= */
function addUserTask(text) {
  const tasks = loadUserTasks();
  tasks.push({
    id: "user_" + Date.now(),
    text,
    source: "user",
  });
  saveUserTasks(tasks);
  renderChecklist();
}

function addDueTask(text, dueDateISO) {
  const tasks = loadDueTasks();
  tasks.push({
    id: "due_" + Date.now(),
    text,
    dueDate: dueDateISO
  });
  saveDueTasks(tasks);
  renderChecklist();
}

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

        // Checked-off user tasks disappear permanently
        if (task.source === "user") {
          saveUserTasks(loadUserTasks().filter(t => t.id !== task.id));
        }

        // Checked-off due tasks disappear permanently
        if (task.source === "due") {
          saveDueTasks(loadDueTasks().filter(t => t.id !== task.id));
        }
      } else {
        // If unchecked, keep task, just remove check state
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

    if (task.source === "default" && !cb.checked) {
      defaultsComplete = false;
    }
  });

  // Celebration: only when ALL default tasks (for that date) are checked
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
   TRACKER (Tabs + Week select + Render + Weight)
========================================================= */
function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  if (!tabs.length) return;

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

function ensureWeeksAvailable() {
  if (!window.WEEKS || !Array.isArray(window.WEEKS) || window.WEEKS.length === 0) {
    console.error("window.WEEKS is missing/empty. Check weeks/week1.js..weekN.js and weeks/weeks.js load order.");
    return false;
  }
  return true;
}

function initWeekSelect() {
  const select = $("weekSelect");
  if (!select) return;
  if (!ensureWeeksAvailable()) return;

  select.innerHTML = "";

  window.WEEKS.forEach((weekObj, idx) => {
    const opt = document.createElement("option");
    // Use explicit id if present, else index
    const val = weekObj.id || ("week_" + idx);
    opt.value = val;
    opt.textContent = weekObj.title || val;
    select.appendChild(opt);
  });

  // Default: pick the week that contains today's date (if possible), else first
  const today = todayISO();
  let defaultIdx = 0;
  for (let i = 0; i < window.WEEKS.length; i++) {
    const w = window.WEEKS[i];
    if (w.startDate && w.endDate) {
      if (today >= w.startDate && today <= w.endDate) {
        defaultIdx = i;
        break;
      }
    }
  }

  const defaultWeek = window.WEEKS[defaultIdx];
  select.value = defaultWeek.id || ("week_" + defaultIdx);
  renderWeekBySelectValue(select.value);

  select.addEventListener("change", () => {
    renderWeekBySelectValue(select.value);
  });
}

function getWeekBySelectValue(val) {
  if (!ensureWeeksAvailable()) return null;

  // Try to match by id first
  const byId = window.WEEKS.find(w => (w.id && w.id === val));
  if (byId) return byId;

  // Fallback: "week_#" format
  if (val.startsWith("week_")) {
    const idx = parseInt(val.replace("week_", ""), 10);
    if (!isNaN(idx) && window.WEEKS[idx]) return window.WEEKS[idx];
  }

  // Fallback: first
  return window.WEEKS[0] || null;
}

/* ---- Rendering helpers (flexible with your week data) ----
   Supports either:
   - week.menuHTML / week.groceryHTML / week.workoutHTML
   OR
   - week.menu (string or array) + week.grocery (object/arrays) ...
*/
function renderWeekBySelectValue(val) {
  const week = getWeekBySelectValue(val);
  if (!week) return;

  if ($("weekTitle")) $("weekTitle").textContent = week.title || "Week";

  // MENU
  const menuEl = $("menuContent");
  if (menuEl) {
    if (typeof week.menuHTML === "string") {
      menuEl.innerHTML = week.menuHTML;
    } else if (typeof week.menu === "string") {
      menuEl.innerHTML = `<div class="day-block"><div>${escapeHTML(week.menu)}</div></div>`;
    } else if (Array.isArray(week.menu)) {
      // If it's an array of day blocks / strings
      menuEl.innerHTML = week.menu.map(x => {
        if (typeof x === "string") return `<div class="day-block"><div>${escapeHTML(x)}</div></div>`;
        if (isPlainObject(x) && x.day && x.text) {
          return `<div class="day-block"><div class="day-name">${escapeHTML(x.day)}</div><div>${escapeHTML(x.text)}</div></div>`;
        }
        return "";
      }).join("");
    } else {
      menuEl.innerHTML = `<div class="small">No menu data found for this week.</div>`;
    }
  }

  // GROCERIES
  const gEl = $("groceryContent");
  if (gEl) {
    if (typeof week.groceryHTML === "string") {
      gEl.innerHTML = week.groceryHTML;
    } else if (isPlainObject(week.grocery)) {
      // Expect: { proteins: [{key,label}], veggies: [...], other: [...] }
      gEl.innerHTML = renderGroceryCheckboxes(week);
    } else {
      gEl.innerHTML = `<div class="small">No grocery data found for this week.</div>`;
    }
  }

  // WORKOUT
  const wEl = $("workoutContent");
  if (wEl) {
    if (typeof week.workoutHTML === "string") {
      wEl.innerHTML = week.workoutHTML;
    } else if (typeof week.workout === "string") {
      wEl.innerHTML = `<div class="day-block"><div>${escapeHTML(week.workout)}</div></div>`;
    } else if (!wEl.innerHTML.trim()) {
      // leave as-is if you hardcoded workout blocks in index.html
      // (do nothing)
    }
  }
}

/* ---- Grocery checklist persistence per week ---- */
function groceryStorageKey(week) {
  const id = week.id || week.title || week.startDate || "week";
  return "lucy_grocery_checked_" + id;
}
function loadGroceryChecked(week) {
  return JSON.parse(localStorage.getItem(groceryStorageKey(week)) || "{}");
}
function saveGroceryChecked(week, checkedMap) {
  localStorage.setItem(groceryStorageKey(week), JSON.stringify(checkedMap));
}

function renderGroceryCheckboxes(week) {
  const g = week.grocery;
  const checked = loadGroceryChecked(week);

  function section(title, items) {
    if (!Array.isArray(items) || items.length === 0) return "";
    const rows = items.map(item => {
      const key = item.key || item.label || ("item_" + Math.random());
      const label = item.label || String(key);
      const isChecked = !!checked[key];

      return `
        <div class="task-row">
          <input type="checkbox" data-gkey="${escapeHTML(key)}" ${isChecked ? "checked" : ""}/>
          <span class="task-text ${isChecked ? "checked" : ""}">${escapeHTML(label)}</span>
        </div>
      `;
    }).join("");

    return `
      <div class="day-block">
        <div class="day-name">${escapeHTML(title)}</div>
        ${rows}
      </div>
    `;
  }

  const html =
    section("Proteins", g.proteins) +
    section("Veggies", g.veggies) +
    section("Other", g.other);

  // After inject, wire handlers
  setTimeout(() => {
    const boxContainer = $("groceryContent");
    if (!boxContainer) return;

    boxContainer.querySelectorAll('input[type="checkbox"][data-gkey]').forEach(cb => {
      cb.addEventListener("change", () => {
        const k = cb.getAttribute("data-gkey");
        const map = loadGroceryChecked(week);
        if (cb.checked) map[k] = true;
        else delete map[k];
        saveGroceryChecked(week, map);

        // Update strike-through immediately
        const text = cb.parentElement.querySelector(".task-text");
        if (text) {
          if (cb.checked) text.classList.add("checked");
          else text.classList.remove("checked");
        }
      });
    });
  }, 0);

  return html;
}

/* ---- Weight tracker ---- */
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
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHTML(e.date)}</td><td>${Number(e.weight).toFixed(1)}</td>`;
      tableBody.appendChild(tr);
    });
  }

  let chart = null;
  function renderChart() {
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map(e => e.date);
    const values = sorted.map(e => e.weight);

    if (chart) chart.destroy();
    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Weight (kg)",
          data: values,
          tension: 0.2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
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
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Nav wiring
  if ($("goTracker")) $("goTracker").addEventListener("click", () => showView("trackerView"));
  if ($("goChecklist")) $("goChecklist").addEventListener("click", () => showView("checklistView"));
  if ($("backFromTracker")) $("backFromTracker").addEventListener("click", () => showView("homeView"));
  if ($("backFromChecklist")) $("backFromChecklist").addEventListener("click", () => showView("homeView"));

  // Labels
  if ($("todayLabel")) $("todayLabel").textContent = "Today: " + todayISO();
  if ($("checklistDateLabel")) $("checklistDateLabel").textContent = "Today: " + todayISO();

  // Due task inputs
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

  // Start systems
  initTracker();
  renderChecklist();
});
