/* =========================================================
   Utilities
========================================================= */
function $(id) {
  return document.getElementById(id);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfWeekISO(iso) {
  return new Date(iso + "T00:00:00").getDay(); // 0 Sun ... 6 Sat
}

function weekNumberISO(iso) {
  const d = new Date(iso + "T00:00:00");
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
function daysUntil(dueISO, fromISO = todayISO()) {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(dueISO + "T00:00:00");
  return Math.round((b - a) / 86400000); // positive = days left
}

function dueLabel(dueISO) {
  const d = daysUntil(dueISO);
  if (d > 1) return { text: `Due in ${d} days`, overdue: false };
  if (d === 1) return { text: "Due tomorrow", overdue: false };
  if (d === 0) return { text: "Due today", overdue: false };
  return { text: `Overdue by ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"}`, overdue: true };
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
function loadDueTasks() {
  return JSON.parse(localStorage.getItem("lucy_due_tasks") || "[]");
}

function saveDueTasks(tasks) {
  localStorage.setItem("lucy_due_tasks", JSON.stringify(tasks));
}

/* =========================================================
   DEFAULT TASKS
========================================================= */
function getDefaultTasksForDate(iso) {
  const day = dayOfWeekISO(iso);
  const week = weekNumberISO(iso);

  const tasks = [];

  // Daily
  tasks.push({ id: "weight", text: "Record weight", source: "default" });
  tasks.push({ id: "shower", text: "Shower", source: "default" });

  // Gym Mon–Thu
  if ([1,2,3,4].includes(day)) {
    tasks.unshift({ id: "gym", text: "Gym / Cardio", source: "default" });
  }

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
    iso = d.toISOString().slice(0,10);
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
    el.style.animationDuration = 700 + Math.random()*600 + "ms";
    layer.appendChild(el);
  }

  setTimeout(() => {
    layer.style.display = "none";
    layer.innerHTML = "";
  }, 1200);
}

/* =========================================================
   CHECKLIST RENDER
========================================================= */
function renderChecklist() {
  const iso = todayISO();
  const listEl = $("checklistList");
  if (!listEl) return;

  listEl.innerHTML = "";

   const defaults = getDefaultTasksForDate(iso);
   const userTasks = loadUserTasks();
   
   // homework/projects with due dates (show daily until checked)
   const dueTasks = loadDueTasks().map(t => ({
     id: t.id,
     text: t.text,
     source: "due",
     dueDate: t.dueDate
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
   let meta = null;
   if (task.source === "due" && task.dueDate) {
     const info = dueLabel(task.dueDate);
     meta = document.createElement("span");
     meta.className = "task-meta" + (info.overdue ? " overdue" : "");
     meta.textContent = `(${info.text})`;
   }
    if (cb.checked) text.classList.add("checked");

    cb.addEventListener("change", () => {
      const st = loadTaskState(iso);

      if (cb.checked) {
        st[task.id] = true;
        text.classList.add("checked");

        // Remove user tasks permanently
        if (task.source === "user") {
          saveUserTasks(loadUserTasks().filter(t => t.id !== task.id));
        }
      // Remove due tasks permanently
      if (task.source === "due") {
        saveDueTasks(loadDueTasks().filter(t => t.id !== task.id));
      }

      } else {
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

  // Celebration
  if (defaultsComplete && !wasDailyComplete(iso)) {
    markDailyComplete(iso);
    popConfetti();
  }

  // Streak UI
  const streak = computeStreak();
  if ($("streakText")) $("streakText").textContent = `${streak} day streak`;
}


/* =========================================================
   ADD USER TASK
========================================================= */
function addUserTask(text) {
  const tasks = loadUserTasks();
  tasks.push({
    id: "user_" + Date.now(),
    text,
    source: "user"
  });
  saveUserTasks(tasks);
  renderChecklist();
}

/* =========================================================
   INIT
========================================================= */
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
document.addEventListener("DOMContentLoaded", () => {
  if ($("checklistDateLabel")) {
    $("checklistDateLabel").textContent = "Today: " + todayISO();
  }

  if ($("addTaskBtn") && $("newTaskInput")) {
    $("addTaskBtn").addEventListener("click", () => {
      const val = $("newTaskInput").value.trim();
      if (!val) return;
      addUserTask(val);
      $("newTaskInput").value = "";
    });
   if ($("hwDueInput")) $("hwDueInput").value = todayISO();
   
   if ($("addHwBtn") && $("hwInput") && $("hwDueInput")) {
     $("addHwBtn").addEventListener("click", () => {
       const text = $("hwInput").value.trim();
       const due = $("hwDueInput").value; // YYYY-MM-DD
       if (!text || !due) return;
       addDueTask(text, due);
       $("hwInput").value = "";
     });
   }
  }

  renderChecklist();
});
