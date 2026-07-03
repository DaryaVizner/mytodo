'use strict';

(function () {
  var STORAGE_KEY = 'my-todo-tasks';

  var tasks  = load();   
  var filter = 'all';    
  var sort   = 'created'; 

  var form       = document.getElementById('add-form');
  var input      = document.getElementById('task-input');
  var list       = document.getElementById('task-list');
  var empty      = document.getElementById('empty');
  var counter    = document.getElementById('counter');
  var sortSelect = document.getElementById('sort');
  var filterBtns = document.querySelectorAll('[data-filter]');

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return []; 
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function addTask(text) {
    var clean = text.trim();
    if (!clean) return;
    tasks.push({ id: Date.now(), text: clean, done: false, created: Date.now() });
    save();
    render();
  }

  function toggleTask(id) {
    var t = tasks.find(function (t) { return t.id === id; });
    if (t) { t.done = !t.done; save(); render(); }
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    save();
    render();
  }

  function visibleTasks() {
    var arr = tasks.slice();
    if (filter === 'active') arr = arr.filter(function (t) { return !t.done; });
    if (filter === 'done')   arr = arr.filter(function (t) { return t.done; });

    if (sort === 'alpha')   arr.sort(function (a, b) { return a.text.localeCompare(b.text); });
    if (sort === 'status')  arr.sort(function (a, b) { return a.done - b.done; });
    if (sort === 'created') arr.sort(function (a, b) { return b.created - a.created; });
    return arr;
  }

  function render() {
    list.textContent = ''; 
    var items = visibleTasks();

    items.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task' + (task.done ? ' task--done' : '');

      var check = document.createElement('input');
      check.type = 'checkbox';
      check.className = 'task__check';
      check.checked = task.done;
      check.addEventListener('change', function () { toggleTask(task.id); });

      var span = document.createElement('span');
      span.className = 'task__text';
      span.textContent = task.text; 

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'task__del';
      del.textContent = '×';
      del.setAttribute('aria-label', 'Удалить задачу');
      del.addEventListener('click', function () { deleteTask(task.id); });

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });

    var left = tasks.filter(function (t) { return !t.done; }).length;
    counter.textContent = 'Осталось: ' + left;
    empty.hidden = items.length !== 0;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filter = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      render();
    });
  });

  sortSelect.addEventListener('change', function () {
    sort = sortSelect.value;
    render();
  });

  render();
})();