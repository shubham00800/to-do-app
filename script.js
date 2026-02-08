const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const count = document.getElementById("count");
const filters = document.querySelectorAll(".filters button");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";
let theme = localStorage.getItem("theme") || "dark";

document.body.className = theme;

/* ADD TASK */
addBtn.onclick = () => {
  if (!input.value.trim()) return;
  tasks.push({ text: input.value, completed: false });
  input.value = "";
  save();
};

/* FILTER */
filters.forEach(btn => {
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

/* THEME */
themeBtn.onclick = () => {
  theme = theme === "dark" ? "light" : "dark";
  document.body.className = theme;
  localStorage.setItem("theme", theme);
};

/* TASK ACTIONS */
function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  save();
}

function editTask(i) {
  const text = prompt("Edit task:", tasks[i].text);
  if (text) {
    tasks[i].text = text;
    save();
  }
}

function deleteTask(i) {
  tasks.splice(i, 1);
  save();
}

/* RENDER */
function render() {
  list.innerHTML = "";

  tasks
    .filter(t =>
      filter === "all" ||
      (filter === "active" && !t.completed) ||
      (filter === "completed" && t.completed)
    )
    .forEach((task, i) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <span onclick="toggleTask(${i})">${task.text}</span>
        <div class="actions">
          <button onclick="editTask(${i})">✏️</button>
          <button onclick="deleteTask(${i})">🗑</button>
        </div>
      `;
      list.appendChild(li);
    });

  count.textContent = `${tasks.filter(t => !t.completed).length} tasks remaining`;
  drawPieGraph();
}

/* PIE GRAPH */
function drawPieGraph() {
  const canvas = document.getElementById("taskChart");
  const ctx = canvas.getContext("2d");

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const total = completed + pending;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (total === 0) {
    ctx.fillText("No tasks", 120, 90);
    return;
  }

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 60;
  let start = 0;

  const pAngle = (pending / total) * Math.PI * 2;
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, start, start + pAngle);
  ctx.fill();
  start += pAngle;

  const cAngle = (completed / total) * Math.PI * 2;
  ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, start, start + cAngle);
  ctx.fill();
}

/* SAVE */
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

render();
