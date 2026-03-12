// Смена темы
const buttonChangeThemeElement = document.querySelector('.btn_change_theme');

buttonChangeThemeElement.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
})

// Todo 
let todos = [];

const defaultTodos = [
  {
    id: Date.now(),
    text: "Первая задача",
    isCompleted: false,
  },
  {
    id: Date.now() + 1,
    text: "Вторая задача для примера",
    isCompleted: true,
  },
];

const todoListElement = document.querySelector('.todo__list');

const STORAGE_KEY = 'todos';


function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return defaultTodos;
  }

  return JSON.parse(savedTodos);
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todos') || []);
}

function createTodoItem (todo) {
  const itemElement = document.createElement('li');

  itemElement.className = 'todo-item';

  itemElement.dataset.id = String(todo.id);

  if (todo.isCompleted) {
    itemElement.classList.add('is-completed');
  }

  itemElement.innerHTML = `
    <button class="todo-item__toggle" type="button">
      ${todo.completed ? '✅' : '⬜'}
    </button>
    <span class="todo-item__text">${todo.text}</span>
    <button class="todo-item__delete" type="button">Удалить</button>
  `

  return itemElement;
}

function renderTodoElement(todo) {
  const itemElement = createTodoItem(todo);

  todoListElement.append(itemElement);
}

function renderTodoList() {
  todoListElement.innerHTML = '';

  todos.forEach(todo => {
    renderTodoElement(todo);
  });
}

function init() {
  todos = loadTodos();
  saveTodos();
  renderTodoList();
}

init()