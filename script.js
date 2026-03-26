// Смена темы
const buttonChangeThemeElement = document.querySelector('.btn_change_theme');

buttonChangeThemeElement.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
})

// Todo 

const todoListElement = document.querySelector('.todo__list');

const STORAGE_KEY = 'todos';

let todos = [];

function Todo(text, completed) {
  this.id = Date.now();
  this.text = text;

  if (completed != undefined) {
    this.completed = completed;
    return;
  }
  
  this.completed = false;
}

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

const addItemFormElement = document.querySelector('.todo__add-form')
const addItemTextElement = document.querySelector('#new-task');

function addTodo(event) {
  
  event.preventDefault()

  const text = addItemTextElement.value.trim();
  
  if (!text) {
    return alert('Строка пустая')
  }

  const todo = new Todo(text);

  todos.push(todo)

  saveTodos()

  renderTodoElement(todo)

  addItemTextElement.value = ''
  addItemTextElement.focus()
  console.log(todos);
  
  updateTotalTasks()
}

addItemFormElement.addEventListener('submit', addTodo);

//Удаление задачи

// const deleteItemButtonElement = document.querySelector('todo-item__delete');

function deleteTodo(event) {
  const deleteButton = event.target.closest('.todo-item__delete-button');

  if (!deleteButton) {
    return;
  }

  const todoItemElement = event.target.closest('.todo-item')
  
  if (!todoItemElement) {
    return;
  }

  const todoId = todoItemElement.dataset.id

  todoItemElement.classList.add('is-disappearing');

  todos = todos.filter((todo) => {
    return String(todo.id) !== todoId
  })
  
  saveTodos();

  todoItemElement.remove();

  updateTotalTasks()
  
}

todoListElement.addEventListener('click', deleteTodo);

// Переключатель комплитед 

function toggleTodoCompleted(event) {
  const completedControl = event.target.closest('.todo-item__checkbox');

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


// Счетчик задач

const counterTasks = document.querySelector('.todo__total-tasks span');

function updateTotalTasks() {
  counterTasks.textContent = todos.length;
}




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

  if (todo.completed) {
    itemElement.classList.add('completed');
  }

  itemElement.innerHTML = `
    <input 
      type="checkbox" 
      class="todo-item__checkbox" 
      id="${todo.id}"
      ${todo.completed ? 'checked' : ''}
    />
    <label for="${todo.id}" class="todo-item__label">
      ${todo.text}
    </label>
    <button 
      class="todo-item__delete-button" 
      type="button"
      aria-label="Delete"
      title="Delete"
    >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </button>
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
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  todos = loadTodos();
  saveTodos();
  renderTodoList();
  updateTotalTasks()
}



init()
