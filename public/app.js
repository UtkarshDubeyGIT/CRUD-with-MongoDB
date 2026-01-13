// API Base URL - Update this to match your backend server
const API_BASE_URL = "http://localhost:3000/api";

// DOM Elements
const taskForm = document.getElementById("taskForm");
const editForm = document.getElementById("editForm");
const tasksContainer = document.getElementById("tasksContainer");
const refreshBtn = document.getElementById("refreshBtn");
const editModal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const cancelEdit = document.getElementById("cancelEdit");

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Form submission handlers
  taskForm.addEventListener("submit", handleAddTask);
  editForm.addEventListener("submit", handleUpdateTask);

  // Button handlers
  refreshBtn.addEventListener("click", loadTasks);
  closeModal.addEventListener("click", closeEditModal);
  cancelEdit.addEventListener("click", closeEditModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal();
    }
  });
});

// Load all tasks from the backend
async function loadTasks() {
  try {
    tasksContainer.innerHTML = '<p class="loading">Loading tasks...</p>';

    const response = await fetch(`${API_BASE_URL}/notes`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();

    if (tasks.length === 0) {
      tasksContainer.innerHTML = `
                <div class="empty-state">
                    <p>No tasks yet</p>
                    <p>Add your first task above to get started</p>
                </div>
            `;
      return;
    }

    displayTasks(tasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
    tasksContainer.innerHTML = `
            <div class="error">
                <strong>Error loading tasks:</strong> ${error.message}
                <br><small>Make sure your backend server is running and the API endpoint is correct.</small>
            </div>
        `;
  }
}

// Display tasks in the UI
function displayTasks(tasks) {
  tasksContainer.innerHTML = "";

  // Sort tasks by createdAt (most recent first) as a fallback
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.created_at || 0);
    const dateB = new Date(b.createdAt || b.created_at || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  sortedTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    tasksContainer.appendChild(taskCard);
  });
}

// Create a task card element
function createTaskCard(task) {
  const card = document.createElement("div");
  const isCompleted = task.completed === true;
  card.className = `task-card ${isCompleted ? "completed" : ""}`;

  const createdAt = new Date(
    task.createdAt || task.created_at || Date.now()
  ).toLocaleString();
  const statusClass = isCompleted ? "completed" : "pending";
  const statusText = isCompleted ? "Completed" : "Pending";

  card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="task-status ${statusClass}">${statusText}</span>
        </div>
        ${
          task.content
            ? `<div class="task-description">${escapeHtml(task.content)}</div>`
            : ""
        }
        <div class="task-meta">Created: ${createdAt}</div>
        <div class="task-actions">
            <button class="btn btn-secondary" onclick="openEditModal('${
              task._id || task.id
            }')">
                Edit
            </button>
            <button class="btn btn-primary" onclick="toggleTaskStatus('${
              task._id || task.id
            }', ${isCompleted})">
                ${isCompleted ? "Mark Pending" : "Mark Complete"}
            </button>
            <button class="btn btn-secondary" onclick="deleteTask('${
              task._id || task.id
            }')">
                Delete
            </button>
        </div>
    `;

  return card;
}

// Handle adding a new task
async function handleAddTask(e) {
  e.preventDefault();

  const formData = new FormData(taskForm);
  const taskData = {
    title: formData.get("title").trim(),
    content: formData.get("description").trim() || "",
  };

  if (!taskData.title) {
    alert("Please enter a task title");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Task added:", result);

    // Reset form
    taskForm.reset();

    // Reload tasks
    loadTasks();
  } catch (error) {
    console.error("Error adding task:", error);
    alert(`Error adding task: ${error.message}`);
  }
}

// Open edit modal with task data
async function openEditModal(noteId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const task = await response.json();

    // Populate form
    document.getElementById("editTaskId").value = task._id || task.id;
    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDescription").value = task.content || "";
    document.getElementById("editTaskStatus").checked = task.completed === true;

    // Show modal
    editModal.style.display = "block";
  } catch (error) {
    console.error("Error loading task for edit:", error);
    alert(`Error loading task: ${error.message}`);
  }
}

// Close edit modal
function closeEditModal() {
  editModal.style.display = "none";
  editForm.reset();
}

// Handle updating a task
async function handleUpdateTask(e) {
  e.preventDefault();

  const taskId = document.getElementById("editTaskId").value;
  const taskData = {
    title: document.getElementById("editTaskTitle").value.trim(),
    content: document.getElementById("editTaskDescription").value.trim() || "",
    completed: document.getElementById("editTaskStatus").checked,
  };

  if (!taskData.title) {
    alert("Please enter a task title");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Task updated:", result);

    // Close modal and reload tasks
    closeEditModal();
    loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    alert(`Error updating task: ${error.message}`);
  }
}

// Toggle task status (complete/pending)
async function toggleTaskStatus(taskId, currentCompleted) {
  const newCompleted = !currentCompleted;

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: newCompleted }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Task status updated:", result);

    // Reload tasks
    loadTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
    alert(`Error updating task status: ${error.message}`);
  }
}

// Delete a task
async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Task deleted:", result);

    // Reload tasks
    loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert(`Error deleting task: ${error.message}`);
  }
}

// Utility function to escape HTML (prevent XSS)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
