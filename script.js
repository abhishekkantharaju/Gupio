let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to localStorage
function updateStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task from add.html
function addTaskPage() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!text) return alert("Enter task name");

  tasks.push({
    id: Date.now(),
    text,
    priority,
    category,
    dueDate,
    completed: false
  });

  updateStorage();
  location.href = "index.html";
}

// Render tasks on homepage
function renderTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong ${task.completed ? 'style="text-decoration:line-through;opacity:0.6;"' : ''}>
        ${task.text}
      </strong><br>

      <small>${task.priority} | ${task.category} | Due: ${task.dueDate || "No date"}</small>

      <div class="task-actions">
        <button class="complete-btn" onclick="toggleComplete(${task.id})">
          ${task.completed ? "Undo" : "Complete"}
        </button>

        <button class="view-btn" onclick="viewTask(${task.id})">
          View
        </button>

        <button class="delete-btn" onclick="deleteTask(${task.id})">
          Delete
        </button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Toggle completed state
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  updateStorage();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  updateStorage();
  renderTasks();
}

// Open task details page
function viewTask(id) {
  location.href = `task.html?id=${id}`;
}

// Load full details in task.html
function loadTaskDetails() {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));

  const task = tasks.find(t => t.id === id);

  if (!task) return;

  const container = document.getElementById("taskDetails");

  container.innerHTML = `
    <p><strong>Task:</strong> ${task.text}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Category:</strong> ${task.category}</p>
    <p><strong>Due Date:</strong> ${task.dueDate || "None"}</p>
    <p><strong>Status:</strong> ${task.completed ? "Completed" : "Pending"}</p>

    <div class="task-actions" style="margin-top:20px;">
      <button class="complete-btn" onclick="toggleDetailComplete(${task.id})">
        ${task.completed ? "Undo" : "Mark Complete"}
      </button>

      <button class="delete-btn" onclick="deleteDetailTask(${task.id})">
        Delete
      </button>
    </div>
  `;
}

// Complete from details page
function toggleDetailComplete(id) {
  toggleComplete(id);
  loadTaskDetails();
}

// Delete from details page
function deleteDetailTask(id) {
  deleteTask(id);
  location.href = "index.html";
}
