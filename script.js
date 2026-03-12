// Смена темы
const buttonChangeThemeElement = document.querySelector('.btn_change_theme');

buttonChangeThemeElement.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
})

// Todo 

const todoListElement = document.querySelector('.todo__list');

const STORAGE_KEY = 'todos';

let todos = [];

const defaultTodos = [
  {
    id: Date.now(),
    text: "Первая задача",
    completed: false,
  },
  {
    id: Date.now() + 1,
    text: "Вторая задача для примера",
    completed: true,
  },
];

//Добавление задачи

const addItemFormElement = document.querySelector('.addtodo__item')
const addItemTextElement = document.querySelector('.todo-item__addText');

function addTodo(event) {
  event.preventDefault()

  const text = addItemTextElement.value.trim();
  
  if (!text) {
    return alert('Строка пустая')
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
  }

  todos.push(newTodo)

  saveTodos()

  renderTodoElement(newTodo)

  addItemTextElement.value = ''
  addItemTextElement.focus()
  console.log(todos);
  
}

//Удаление задачи

// const deleteItemButtonElement = document.querySelector('todo-item__delete');

function deleteTodo(event) {
  const deleteButton = event.target.closest('.todo-item__delete');

  if (!deleteButton) {
    return;
  }

  const todoItemElement = event.target.closest('.todo-item')
  
  if (!todoItemElement) {
    return;
  }

  const todoId = todoItemElement.dataset.id

  todos = todos.filter((todo) => {
    return String(todo.id) !== todoId
  })

  saveTodos()

  todoItemElement.remove()
}

todoListElement.addEventListener('click', deleteTodo);

// Переключатель комплитед 

function toggleTodoCompleted(event) {
  const completedControl = event.target.closest('.todo-item__toggle');

  if (!completedControl) {
    return;
  }

  const todoItemElement = event.target.closest('.todo-item');

  if (!todoItemElement) {
    return;
  }

  const todoId = todoItemElement.dataset.id;

  const todo = todos.find((todo) => {
    return String(todo.id) === todoId
  })

  if (!todo) {
    return
  }

  todo.completed = !todo.completed

  saveTodos()

  replaceTodoItem(todo)
}
todoListElement.addEventListener('click', toggleTodoCompleted)






addItemFormElement.addEventListener('submit', addTodo);

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
  return JSON.parse(localStorage.getItem('todos') || "[]");
}

function createTodoItem (todo) {
  const itemElement = document.createElement('li');

  itemElement.className = 'todo-item';

  itemElement.dataset.id = String(todo.id);

  if (todo.Completed) {
    itemElement.classList.add('completed');
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

function getTodoElementById(todoId) {
  return todoListElement.querySelector(`[data-id="${todoId}"]`)
}

function replaceTodoItem(todo) {
  const currentTodoElement = getTodoElementById(todo.id)

  if (!currentTodoElement) {
    return
  }

  const newTodoElement = createTodoItem(todo)
  currentTodoElement.replaceWith(newTodoElement)
}

function init() {
  todos = loadTodos();
  saveTodos();
  renderTodoList();
}

init()