const todoList = document.querySelector(".todoList");
const form = document.getElementById("form-todo");
const formInput = document.getElementById("form-input");
const formError = document.getElementById("form-error");
const formErrorOvy = document.getElementById("form-error-ovy");
let editItemId;

const formOverlay = document.getElementById("form-overlay");
const overlay = document.querySelector(".overlay");

const isHasTodo = document.getElementById("isHasTodo");

const overlayInput = document.getElementById("ovy-input");

let todos = JSON.parse(localStorage.getItem("list")) ? JSON.parse(localStorage.getItem("list")) : [];
if (todos.length > 0) {
  showTodos();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let todoValue = formInput.value.trim();
  form.reset();
  if (todoValue) {
    todos.push({ todoText: todoValue, complited: false });
    showTodos();
    setItem();
  } else {
    showError();
  }
});

function showTodos() {
  isHasTodo.classList.remove("none");
  if (todos.length > 0) {
    isHasTodo.classList.add("none");
  }
  overlay.classList.add("none");
  todoList.innerHTML = "";
  todos.forEach((item, idx) => {
    const todo = document.createElement("li");
    todo.addEventListener("dblclick", () => complete(idx));
    todo.textContent = item.todoText;
    if (todo.complited) {
      todo.classList.add("complited");
    } else {
      todo.classList.remove("complited");
    }
    todo.classList.add(`${item.complited == true ? "complited" : "todo"}`);
    todo.innerHTML += `
    <div class="button-section">
    <button onclick=(deleteTodo(${idx}))>delete</button>
    <button onclick=(editTodo(${idx}))>edit</button>
  </div>
    `;
    todoList.appendChild(todo);
  });
}

function setItem() {
  localStorage.setItem("list", JSON.stringify(todos));
}

function deleteTodo(index) {
  const deletedTodo = todos.filter((item, idx) => {
    return index !== idx;
  });

  todos = deletedTodo;
  setItem();
  showTodos();
}

function complete(index) {
  let completedTodo = todos.map((item, idx) => {
    if (index == idx) {
      return { ...item, complited: item.complited == true ? false : true };
    } else {
      return { ...item };
    }
  });

  todos = completedTodo;
  setItem();
  showTodos();
}

function showError() {
  formError.classList.remove("none");
  setTimeout(() => {
    formError.classList.add("none");
  }, 1000);
}

overlay.addEventListener("dblclick", () => {
  close();
});

// edit form
formOverlay.addEventListener("submit", (e) => {
  e.preventDefault();
  let todoValue = overlayInput.value.trim();
  formOverlay.reset();
  if (todoValue) {
    todos.splice(editItemId, 1, { todoText: todoValue, complited: false });
    showTodos();
    setItem();
    close();
  } else {
    formErrorOvy.classList.remove("none");
    setTimeout(() => {
      formErrorOvy.classList.add("none");
    }, 1000);
  }
});

function editTodo(index) {
  editItemId = index;
  overlayInput.value = todos[editItemId].todoText
  open();
}

function open() {
  overlay.classList.remove("none");
}

function close() {
  overlay.classList.add("none");
}
