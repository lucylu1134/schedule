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

// ISO-ish week number helper (your existing one)
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

// =========================================================
// CHECKLIST CLOUD SYNC (Firestore)
// =========================================================

let checklistCloud = {
  loaded: false,
  userTasks: [],
  dueTasks: [],
  dailyCompleteDays: [],
  state: { daily: {}, weekly: {}, biweekly: {} },
};

function getChecklistDocRef() {
  const svc = window.firebaseServices;
  if (!svc) return null;
  const { db, doc } = svc;
  return doc(db, "shared", "lucy_checklist");
}

async function initChecklistCloud() {
  const svc = window.firebaseServices;
  if (!svc) {
    console.error("firebaseServices missing (check index.html).");
    return;
  }

  const { auth, signInAnonymously, getDoc, setDoc, onSnapshot } = svc;

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const ref = getChecklistDocRef();
  if (!ref) return;

  // create doc once if missing
  const initial = await getDoc(ref);
  if (!initial.exists()) {
    await setDoc(ref, {
      version: 1,
      updatedAt: new Date().toISOString(),
      userTasks: [],
      dueTasks: [],
      dailyCompleteDays: [],
      state: { daily: {}, weekly: {}, biweekly: {} },
    });
  }

  // live sync
  onSnapshot(ref, (snap) => {
    const d = snap.data() || {};
    checklistCloud = {
      loaded: true,
      userTasks: Array.isArray(d.userTasks) ? d.userTasks : [],
      dueTasks: Array.isArray(d.dueTasks) ? d.dueTasks : [],
      dailyCompleteDays: Array.isArray(d.dailyCompleteDays) ? d.dailyCompleteDays : [],
      state: d.state && typeof d.state === "object"
        ? {
            daily: d.state.daily || {},
            weekly: d.state.weekly || {},
            biweekly: d.state.biweekly || {},
          }
        : { daily: {}, weekly: {}, biweekly: {} },
    };

    // re-render whenever cloud changes
    renderChecklist();
  });
}

async function saveChecklistCloud() {
  const svc = window.firebaseServices;
  if (!svc) return;
  const { setDoc } = svc;
  const ref = getChecklistDocRef();
  if (!ref) return;

  await setDoc(ref, {
    version: 1,
    updatedAt: new Date().toISOString(),
    userTasks: checklistCloud.userTasks,
    dueTasks: checklistCloud.dueTasks,
    dailyCompleteDays: checklistCloud.dailyCompleteDays,
    state: checklistCloud.state,
  }, { merge: true });
}


/* =========================================================
   STORAGE (tasks lists)
========================================================= */
function loadUserTasks() {
  return checklistCloud.userTasks || [];
}
function saveUserTasks(tasks) {
  checklistCloud.userTasks = tasks;
  saveChecklistCloud();
}

function loadDueTasks() {
  return checklistCloud.dueTasks || [];
}
function saveDueTasks(tasks) {
  checklistCloud.dueTasks = tasks;
  saveChecklistCloud();
}

function loadDailyCompleteDays() {
  return checklistCloud.dailyCompleteDays || [];
}
function saveDailyCompleteDays(days) {
  checklistCloud.dailyCompleteDays = days;
  saveChecklistCloud();
}

function loadScopedState(scope, iso = todayISO()) {
  if (!checklistCloud.state) checklistCloud.state = { daily: {}, weekly: {}, biweekly: {} };
  const bucket = checklistCloud.state[scope] || {};
  const key =
    scope === "weekly" ? isoWeekKey(iso) :
    scope === "biweekly" ? isoBiWeekKey(iso) :
    iso;

  return bucket[key] || {};
}

function saveScopedState(scope, stateObj, iso = todayISO()) {
  if (!checklistCloud.state) checklistCloud.state = { daily: {}, weekly: {}, biweekly: {} };
  if (!checklistCloud.state[scope]) checklistCloud.state[scope] = {};

  const key =
    scope === "weekly" ? isoWeekKey(iso) :
    scope === "biweekly" ? isoBiWeekKey(iso) :
    iso;

  checklistCloud.state[scope][key] = stateObj;
  saveChecklistCloud();
}

/* =========================================================
   Scoped checklist state (daily / weekly / biweekly)
========================================================= */
function isoWeekKey(iso = todayISO()) {
  const d = new Date(iso + "T00:00:00");
  const year = d.getFullYear();
  const week = weekNumberISO(iso);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function isoBiWeekKey(iso = todayISO()) {
  const d = new Date(iso + "T00:00:00");
  const year = d.getFullYear();
  const week = weekNumberISO(iso);
  const block = Math.ceil(week / 2);
  return `${year}-B${String(block).padStart(2, "0")}`;
}

/* =========================================================
   Streak (daily completion)
========================================================= */
function wasDailyComplete(iso) {
  return loadDailyCompleteDays().includes(iso);
}
function markDailyComplete(iso) {
  const set = new Set(loadDailyCompleteDays());
  set.add(iso);
  saveDailyCompleteDays([...set]);
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

/* =========================================================
   Confetti
========================================================= */
function popConfetti() {
  const layer = $("confettiLayer");
  if (!layer) return;

  layer.innerHTML = "";
  layer.style.display = "block";

  // simple confetti pieces
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.width = "8px";
    el.style.height = "12px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-20px";
    el.style.borderRadius = "2px";
    el.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    el.style.transform = `rotate(${Math.random() * 60}deg)`;
    el.style.transition = "transform 1.2s linear, top 1.2s linear, opacity 1.2s linear";
    layer.appendChild(el);

    requestAnimationFrame(() => {
      el.style.top = (60 + Math.random() * 50) + "vh";
      el.style.opacity = "0";
      el.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
    });
  }

  setTimeout(() => {
    layer.style.display = "none";
    layer.innerHTML = "";
  }, 1300);
}

/* =========================================================
   Default tasks (scoped)
========================================================= */
function getDefaultTasksForDate(iso) {
  const day = dayOfWeekISO(iso);
  const week = weekNumberISO(iso);
  const tasks = [];

  // Daily defaults
  if ([1, 2, 3, 4].includes(day)) {
    tasks.push({ id: "gym", text: "Gym / Cardio", source: "default", scope: "daily" });
  }
  tasks.push({ id: "weight", text: "Record weight", source: "default", scope: "daily" });
  tasks.push({ id: "shower", text: "Shower", source: "default", scope: "daily" });

  // Weekly defaults
  tasks.push({ id: "laundry", text: "Laundry", source: "weekly", scope: "weekly" });
  tasks.push({ id: "groceries", text: "Groceries", source: "weekly", scope: "weekly" });
  tasks.push({ id: "journal", text: "Journal", source: "weekly", scope: "weekly" });

  // Biweekly (even weeks)
  if (week % 2 === 0) {
    tasks.push({ id: "bedsheets", text: "Change bedsheets", source: "biweekly", scope: "biweekly" });
  }

  return tasks;
}

/* =========================================================
   Add tasks
========================================================= */
function addUserTask(text) {
  const tasks = loadUserTasks();
  tasks.push({ id: "user_" + Date.now(), text });
  saveUserTasks(tasks);
  renderChecklist();
}

function addDueTask(text, dueDateISO) {
  const tasks = loadDueTasks();
  tasks.push({ id: "due_" + Date.now(), text, dueDate: dueDateISO });
  saveDueTasks(tasks);
  renderChecklist();
}

/* =========================================================
   Checklist render (ONE list, multi-scope states)
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
    dueDate: t.dueDate,
    source: "due",
    scope: "daily" // shown daily until checked
  }));

  const userTasks = loadUserTasks().map(t => ({
    id: t.id,
    text: t.text,
    source: "user",
    scope: "daily" // stored in list, not per-day state
  }));

  const allTasks = [...defaults, ...dueTasks, ...userTasks];

  const dayState = loadScopedState("daily", iso);
  const weekState = loadScopedState("weekly", iso);
  const biweekState = loadScopedState("biweekly", iso);

  function stateForScope(scope) {
    if (scope === "weekly") return weekState;
    if (scope === "biweekly") return biweekState;
    return dayState;
  }

  function saveAll() {
    saveScopedState("daily", dayState, iso);
    saveScopedState("weekly", weekState, iso);
    saveScopedState("biweekly", biweekState, iso);
  }

  // Confetti is for completing DAILY defaults only
  let dailyDefaultsComplete = true;

  allTasks.forEach(task => {
    const scope = task.scope || "daily";
    const st = stateForScope(scope);

    const row = document.createElement("div");
    row.className = "task-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!st[task.id];

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    if (cb.checked) text.classList.add("checked");

    let meta = null;
    if (task.source === "due" && task.dueDate) {
      const info = dueLabel(task.dueDate);
      meta = document.createElement("span");
      meta.className = "task-meta" + (info.overdue ? " overdue" : "");
      meta.textContent = `(${info.text})`;
    }

    cb.addEventListener("change", () => {
      const scopedState = stateForScope(scope);

      if (cb.checked) {
        scopedState[task.id] = true;
        text.classList.add("checked");

        // Completed user tasks disappear from list
        if (task.source === "user") {
          saveUserTasks(loadUserTasks().filter(t => t.id !== task.id));
        }

        // Completed due tasks disappear from list
        if (task.source === "due") {
          saveDueTasks(loadDueTasks().filter(t => t.id !== task.id));
        }
      } else {
        delete scopedState[task.id];
        text.classList.remove("checked");
      }

      saveAll();
      renderChecklist();
    });

    row.appendChild(cb);
    row.appendChild(text);
    if (meta) row.appendChild(meta);
    listEl.appendChild(row);

    if (task.source === "default" && (task.scope || "daily") === "daily") {
      if (!cb.checked) dailyDefaultsComplete = false;
    }
  });

  if (dailyDefaultsComplete && !wasDailyComplete(iso)) {
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
   Tracker: tabs + week select + week render (FIXED)
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

function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMenuFromData(menuArr) {
  if (!Array.isArray(menuArr) || menuArr.length === 0) {
    return "<div class='small'>No menu data found for this week.</div>";
  }

  return menuArr.map(day => {
    const mealsHTML = (day.meals || []).map(m => {
      return `
        <div class="meal-title">${escapeHTML(m.title || "")}</div>
        <div>${escapeHTML(m.text || "")}</div>
      `;
    }).join("");

    return `
      <div class="day-block">
        <div class="day-name">${escapeHTML(day.name || "")}
          ${day.badge ? `<span class="badge">${escapeHTML(day.badge)}</span>` : ""}
        </div>
        ${mealsHTML}
      </div>
    `;
  }).join("");
}

function loadGroceryState(weekId) {
  return JSON.parse(localStorage.getItem(`lucy_grocery_state_${weekId}`) || "{}");
}
function saveGroceryState(weekId, state) {
  localStorage.setItem(`lucy_grocery_state_${weekId}`, JSON.stringify(state));
}

function renderGroceryFromData(weekObj) {
  const groceryObj = weekObj?.grocery;
  if (!groceryObj || typeof groceryObj !== "object") {
    return "<div class='small'>No grocery data found for this week.</div>";
  }

  const weekId = weekObj.id || "unknown_week";
  const state = loadGroceryState(weekId);

  function itemRow(item) {
    const id = item.key || item.label; // stable identifier
    const checked = !!state[id];

    // Use a label so clicking text toggles checkbox
    return `
      <label class="task-row" style="cursor:pointer;">
        <input type="checkbox" data-gkey="${escapeHTML(id)}" ${checked ? "checked" : ""} />
        <span class="task-text ${checked ? "checked" : ""}">${escapeHTML(item.label || "")}</span>
      </label>
    `;
  }

  function section(title, arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return `
      <div class="day-block">
        <div class="day-name">${escapeHTML(title)}</div>
        ${arr.map(itemRow).join("")}
      </div>
    `;
  }

  const html = [
    section("Proteins", groceryObj.proteins),
    section("Veggies", groceryObj.veggies),
    section("Other", groceryObj.other),
  ].join("");

  // After rendering, wire listeners once
  setTimeout(() => {
    document.querySelectorAll("#groceryContent input[type='checkbox'][data-gkey]").forEach(cb => {
      cb.addEventListener("change", () => {
        const k = cb.getAttribute("data-gkey");
        state[k] = cb.checked;
        saveGroceryState(weekId, state);

        // toggle strike-through
        const text = cb.parentElement.querySelector(".task-text");
        if (text) text.classList.toggle("checked", cb.checked);
      });
    });
  }, 0);

  return html;
}

function initWeekSelect() {
  const select = $("weekSelect");
  if (!select) return;

  if (typeof WEEK_LIST === "undefined" || !Array.isArray(WEEK_LIST)) {
    console.error("WEEK_LIST is not defined. Check weeks/weeks.js.");
    return;
  }

  select.innerHTML = "";

  WEEK_LIST.forEach(week => {
    const opt = document.createElement("option");
    opt.value = week.id;
    opt.textContent = week.title || week.label || week.id;
    select.appendChild(opt);
  });

  const first = WEEK_LIST[0];
  if (first) {
    select.value = first.id;
    renderWeek(first.id);
  }

  select.addEventListener("change", () => renderWeek(select.value));
}

function renderWeek(weekId) {
  if (typeof WEEKS === "undefined") return;
  const week = WEEKS[weekId];
  if (!week) return;

  if ($("weekTitle")) $("weekTitle").textContent = week.title || week.label || week.id;

  // MENU: support both menuHTML and menu[]
  const menuEl = $("menuContent");
  if (menuEl) {
    if (week.menuHTML) menuEl.innerHTML = week.menuHTML;
    else menuEl.innerHTML = renderMenuFromData(week.menu);
  }

  // GROCERIES: support both groceryHTML and grocery{}
   const gEl = $("groceryContent");
   if (gEl) {
     if (week.groceryHTML) gEl.innerHTML = week.groceryHTML;
     else gEl.innerHTML = renderGroceryFromData(week); // <--- pass week
   }

  // WORKOUT: optional override
  const wEl = $("workoutContent");
  if (wEl && week.workoutHTML) {
    wEl.innerHTML = week.workoutHTML;
  }
}

function initTracker() {
  initTabs();
  initWeekSelect();
  initWeightTracker();
}

/* =========================================================
   Weight tracker
========================================================= */
async function initWeightTracker() {
  const dateInput = $("dateInput");
  const weightInput = $("weightInput");
  const addBtn = $("addBtn");
  const tableBody = document.querySelector("#weightTable tbody");
  const canvas = $("weightChart");
  if (!dateInput || !weightInput || !addBtn || !tableBody || !canvas) return;

  // ---- Firebase handles ----
  const svc = window.firebaseServices;
  if (!svc) {
    console.error("firebaseServices missing. Check index.html module script.");
    return;
  }
  const { auth, db, signInAnonymously, doc, getDoc, setDoc, onSnapshot } = svc;

  // Sign in anonymously
  if (!auth.currentUser) {
     await signInAnonymously(auth);
   }
  const weightDocRef = doc(db, "shared", "lucy_weight_log");

  // ---- Local state ----
  let data = [];
  let chart = null;

  function normalizeAndSort(arr) {
    const map = new Map();
    (arr || []).forEach(e => {
      if (!e || !e.date) return;
      const w = Number(e.weight);
      if (!Number.isFinite(w)) return;
      map.set(e.date, { date: e.date, weight: w });
    });
    return [...map.values()].sort((a,b) => new Date(a.date) - new Date(b.date));
  }

  function renderTable() {
    tableBody.innerHTML = "";
    data.forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${e.date}</td><td>${Number(e.weight).toFixed(1)}</td>`;
      tableBody.appendChild(tr);
    });
  }

  function renderChart() {
    if (!data.length) {
      if (chart) chart.destroy();
      chart = null;
      return;
    }

    const labels = data.map(e => e.date);
    const values = data.map(e => Number(e.weight));

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(0.5, max - min);
    const pad = Math.max(0.5, span * 0.25);

    if (chart) chart.destroy();
    chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [{ label: "Weight (kg)", data: values, tension: 0.25, pointRadius: 3 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          y: {
            suggestedMin: min - pad,
            suggestedMax: max + pad,
            ticks: { stepSize: 0.5 }
          }
        }
      }
    });
  }

  async function saveToCloud() {
    const payload = { version: 1, updatedAt: new Date().toISOString(), data };
    await setDoc(weightDocRef, payload, { merge: true });
  }

  // Live sync: whenever cloud changes, update UI
  onSnapshot(weightDocRef, (snap) => {
    const cloud = snap.exists() ? snap.data() : null;
    data = normalizeAndSort(cloud?.data || []);
    renderTable();
    renderChart();
  });

  // If doc doesn’t exist yet, create it once
  const initial = await getDoc(weightDocRef);
  if (!initial.exists()) {
    await setDoc(weightDocRef, { version: 1, updatedAt: new Date().toISOString(), data: [] });
  }

  // Add entry -> write to cloud
  addBtn.addEventListener("click", async () => {
    const d = dateInput.value;
    const w = parseFloat(weightInput.value);
    if (!d || !Number.isFinite(w)) return;

    // upsert
    const idx = data.findIndex(x => x.date === d);
    if (idx >= 0) data[idx].weight = w;
    else data.push({ date: d, weight: w });

    data = normalizeAndSort(data);
    await saveToCloud();
    weightInput.value = "";
  });

  dateInput.value = todayISO();
}

/* =========================================================
   Routing (home / tracker / checklist)
========================================================= */
function showView(viewId) {
  ["homeView", "trackerView", "checklistView"].forEach(id => {
    const el = $(id);
    if (el) el.style.display = (id === viewId ? "block" : "none");
  });
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Nav
  if ($("goTracker")) $("goTracker").addEventListener("click", () => showView("trackerView"));
  if ($("goChecklist")) $("goChecklist").addEventListener("click", () => showView("checklistView"));
  if ($("backFromTracker")) $("backFromTracker").addEventListener("click", () => showView("homeView"));
  if ($("backFromChecklist")) $("backFromChecklist").addEventListener("click", () => showView("homeView"));

  // Labels
  if ($("todayLabel")) $("todayLabel").textContent = "Today: " + todayISO();
  if ($("checklistDateLabel")) $("checklistDateLabel").textContent = "Today: " + todayISO();

  // Homework/projects
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

  // Manual tasks
  if ($("addTaskBtn") && $("newTaskInput")) {
    $("addTaskBtn").addEventListener("click", () => {
      const val = $("newTaskInput").value.trim();
      if (!val) return;
      addUserTask(val);
      $("newTaskInput").value = "";
    });
  }

   initChecklistCloud();
  initTracker();
});
