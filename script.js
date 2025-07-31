const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const toggleThemeBtn = document.getElementById("toggleTheme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedIndex = null;

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.text;
    taskItem.className = task.completed ? "completed" : "";
    taskItem.setAttribute("draggable", true);
    taskItem.dataset.index = index;

    // Toggle completion
    taskItem.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Drag-and-drop events
    taskItem.addEventListener("dragstart", dragStart);
    taskItem.addEventListener("dragover", dragOver);
    taskItem.addEventListener("drop", drop);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.className = "delete";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    taskItem.appendChild(delBtn);
    taskList.appendChild(taskItem);
  });
}

// Add task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Drag and drop logic
function dragStart(e) {
  draggedIndex = +e.target.dataset.index;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  const targetIndex = +e.target.dataset.index;
  const draggedItem = tasks[draggedIndex];
  tasks.splice(draggedIndex, 1);
  tasks.splice(targetIndex, 0, draggedItem);
  saveTasks();
  renderTasks();
}

// Toggle dark mode
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load theme on startup
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  renderTasks();
});
