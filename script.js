const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addBtn.addEventListener("click", addTask);

function addTask() {
    if (taskInput.value.trim() === "") return alert("Enter a task");

    tasks.push({
        text: taskInput.value,
        completed: false
    });

    taskInput.value = "";
    saveAndRender();
}
function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks
        .map((task, index) => ({ task, index })) // keep original index
        .filter(obj => {
            if (currentFilter === "completed") return obj.task.completed;
            if (currentFilter === "pending") return !obj.task.completed;
            return true;
        });

    filteredTasks.forEach(({ task, index }) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" 
                       onchange="toggleTask(${index})"
                       ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="edit" onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function editTask(index) {
    const newTask = prompt("Edit task", tasks[index].text);
    if (newTask) {
        tasks[index].text = newTask;
        saveAndRender();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

renderTasks();