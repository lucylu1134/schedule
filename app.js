// ===== Tab switching =====
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

// ===== Week / menu rendering =====
const weekSelect = document.getElementById('weekSelect');
const weekTitleEl = document.getElementById('weekTitle');
const menuContentEl = document.getElementById('menuContent');
const groceryContentEl = document.getElementById('groceryContent');

// Fill week selector from WEEKS data
WEEKS.forEach(week => {
  const opt = document.createElement('option');
  opt.value = week.id;
  opt.textContent = week.label;
  weekSelect.appendChild(opt);
});

// Render selected week
function renderWeek(weekId) {
  const week = WEEKS.find(w => w.id === weekId) || WEEKS[0];
  weekTitleEl.textContent = week.title;

  // ----- Render menu -----
  menuContentEl.innerHTML = "";
  week.menu.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-block';
    let html = `<div class="day-name">${day.name}`;
    if (day.badge) {
      html += ` <span class="badge">${day.badge}</span>`;
    }
    html += `</div>`;
    day.meals.forEach(m => {
      html += `<div class="meal-title">${m.title}</div><div>${m.text}</div>`;
    });
    dayDiv.innerHTML = html;
    menuContentEl.appendChild(dayDiv);
  });

  // ----- Render grocery -----
  groceryContentEl.innerHTML = "";

  const secTitle1 = document.createElement('div');
  secTitle1.className = 'section-title';
  secTitle1.textContent = '蛋白质';
  groceryContentEl.appendChild(secTitle1);

  const ulProteins = document.createElement('ul');
  ulProteins.className = 'checklist';
  groceryContentEl.appendChild(ulProteins);

  const secTitle2 = document.createElement('div');
  secTitle2.className = 'section-title';
  secTitle2.textContent = '蔬菜（四蔬菜固定版）';
  groceryContentEl.appendChild(secTitle2);

  const ulVeggies = document.createElement('ul');
  ulVeggies.className = 'checklist';
  groceryContentEl.appendChild(ulVeggies);

  const secTitle3 = document.createElement('div');
  secTitle3.className = 'section-title';
  secTitle3.textContent = '早餐 & 其他';
  groceryContentEl.appendChild(secTitle3);

  const ulOther = document.createElement('ul');
  ulOther.className = 'checklist';
  groceryContentEl.appendChild(ulOther);

  // State per week
  const storageKey = `lucy_grocery_${week.id}`;
  let groceryState = JSON.parse(localStorage.getItem(storageKey) || '{}');

  function addItems(listEl, items) {
    items.forEach(item => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'grocery-checkbox';
      cb.dataset.key = item.key;
      label.appendChild(cb);
      label.append(item.label);
      li.appendChild(label);
      listEl.appendChild(li);

      // restore state
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
    });
  }

  addItems(ulProteins, week.grocery.proteins);
  addItems(ulVeggies, week.grocery.veggies);
  addItems(ulOther, week.grocery.other);

  const note = document.createElement('p');
  note.className = 'small';
  note.textContent = "提示：如果某周不需要全部食材，可以在 GitHub 里编辑 data.js 中对应周的 grocery 列表。";
  groceryContentEl.appendChild(note);
}

// Default to first week
weekSelect.value = WEEKS[0].id;
renderWeek(weekSelect.value);

// When user changes week
weekSelect.addEventListener('change', () => {
  renderWeek(weekSelect.value);
});

// ===== Weight tracking with localStorage + chart =====
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
      datasets: [{
        label: '体重 (kg)',
        data: values,
        tension: 0.2,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { ticks: { stepSize: 1 } }
      }
    }
  });
}

function saveWeightData() {
  localStorage.setItem('lucy_weight_data', JSON.stringify(weightData));
}

addBtn.addEventListener('click', () => {
  const date = dateInput.value;
  const weight = parseFloat(weightInput.value);
  if (!date || isNaN(weight)) return;
  const existingIndex = weightData.findIndex(e => e.date === date);
  if (existingIndex >= 0) {
    weightData[existingIndex].weight = weight;
  } else {
    weightData.push({ date, weight });
  }
  saveWeightData();
  renderTable();
  renderChart();
  weightInput.value = '';
});

// Initial render if you already have data
if (weightData.length) {
  renderTable();
  renderChart();
}
