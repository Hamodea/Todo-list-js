document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const authorInput = document.getElementById("author-input");
    const todoList = document.getElementById("todo-list");
    const sortTimestampButton = document.getElementById("sort-timestamp");
    const sortAuthorButton = document.getElementById("sort-author");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = "";
        todos.forEach(function (todo, index) {
            const li = document.createElement("li");
            li.className = todo.completed ? "completed" : "";

            li.innerHTML = `
                            <span class="todo-text" style="text-decoration: ${todo.completed ? 'line-through' : 'none'}">
                ${todo.text}
            </span>
            <p>Author: ${todo.author} | Timestamp: ${new Date(todo.timestamp).toLocaleString()}</p>
            <div>
                <button class="action complete">
                <span class="material-symbols-outlined">${todo.completed ? 'undo' : 'done'}</span>
                </button>
                <button class="action edit">
                <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="action up">
                <span class="material-symbols-outlined">arrow_upward</span>
                </button>
                <button class="action down">
                <span class="material-symbols-outlined">arrow_downward</span>
                </button>
                <button class="action remove">
                <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
            `;

            // Mark as completed/undo
            li.querySelector(".complete").addEventListener("click", function () {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            });

            // Edit todo in place
            li.querySelector(".edit").addEventListener("click", function () {
                const newText = prompt("Edit your todo:", todo.text);
                if (newText !== null) {
                    todo.text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            });

            // Move up
            li.querySelector(".up").addEventListener("click", function () {
                if (index > 0) {
                    [todos[index - 1], todos[index]] = [todos[index], todos[index - 1]];
                    saveTodos();
                    renderTodos();
                }
            });

            // Move down
            li.querySelector(".down").addEventListener("click", function () {
                if (index < todos.length - 1) {
                    [todos[index + 1], todos[index]] = [todos[index], todos[index + 1]];
                    saveTodos();
                    renderTodos();
                }
            });

            // Remove todo
            li.querySelector(".remove").addEventListener("click", function () {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            todoList.appendChild(li);
        });
    }

    // Add new todo
    todoForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        const author = authorInput.value.trim();
        if (text && author) {
            todos.push({
                text,
                author,
                completed: false,
                timestamp: Date.now()
            });
            saveTodos();
            renderTodos();
            todoForm.reset();
        }
    });

    // Sort by timestamp (default)
    sortTimestampButton.addEventListener("click", function () {
        todos.sort((a, b) => a.timestamp - b.timestamp);
        saveTodos();
        renderTodos();
    });

    // Sort by author
    sortAuthorButton.addEventListener("click", function () {
        todos.sort((a, b) => a.author.localeCompare(b.author));
        saveTodos();
        renderTodos();
    });

    // Initial render
    renderTodos();
});
