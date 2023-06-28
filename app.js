// Obtém elementos do DOM
const taskForm = document.querySelector('.task-form');
const taskInput = document.getElementById('task-input');
const taskHoursInput = document.querySelector('#task-hours');
const taskList = document.getElementById('task-list');
const allTasksButton = document.getElementById('all-tasks');
const completedTasksButton = document.getElementById('completed-tasks');
const activeTasksButton = document.getElementById('active-tasks');

let tasks = [];

// Evento de submissão do formulário
taskForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Impede o comportamento padrão de recarregar a página

  const taskTitle = taskInput.value.trim();
  const taskHours = taskHoursInput.value.trim();

  if (taskTitle === '') {
    displayErrorMessage('O preenchimento do título é obrigatório para adicionar uma tarefa', taskInput);
    return;
  }

  if (taskHours === '') {
    displayErrorMessage('O preenchimento do tempo é obrigatório para adicionar uma tarefa', taskHoursInput);
    return;
  }

  addTask(taskTitle, taskHours); // Adiciona a tarefa à lista
  taskInput.value = ''; // Limpa o campo de título
  taskHoursInput.value = ''; // Limpa o campo de horas

  displaySuccessMessage('Sua tarefa foi adicionada com sucesso');
});

// Função para exibir mensagem de erro
function displayErrorMessage(message, field) {
  const errorElement = document.createElement('p');
  errorElement.classList.add('error-message');
  errorElement.style.fontWeight = 'bold';
  errorElement.textContent = message;

  const existingErrorElement = field.parentElement.querySelector('.error-message');
  if (existingErrorElement) {
    existingErrorElement.remove();
  }

  field.parentElement.insertBefore(errorElement, field.nextSibling);

  setTimeout(function() {
    errorElement.remove();
  }, 3000);
}

// Função para exibir mensagem de sucesso
function displaySuccessMessage(message) {
  const successElement = document.createElement('p');
  successElement.classList.add('success-message');
  successElement.style.fontWeight = 'bold';
  successElement.textContent = message;

  const existingSuccessElement = taskForm.querySelector('.success-message');
  if (existingSuccessElement) {
    existingSuccessElement.remove();
  }

  taskForm.insertBefore(successElement, taskInput.nextSibling);

  setTimeout(function() {
    successElement.remove();
  }, 3000);
}

// Função para exibir mensagem de sucesso
function displaySuccessMessage(message) {
  const successElement = document.createElement('p');
  successElement.classList.add('success-message');
  successElement.style.fontWeight = 'bold';
  successElement.textContent = message;

  const existingSuccessElement = taskForm.querySelector('.success-message');
  if (existingSuccessElement) {
    existingSuccessElement.remove();
  }

  taskForm.insertBefore(successElement, taskInput.nextSibling);

  setTimeout(function() {
    successElement.remove();
  }, 3000);
}

// Evento de clique na lista de tarefas
taskList.addEventListener('click', function(e) {
  const target = e.target;

  if (target.classList.contains('task-checkbox')) {
    const taskId = target.getAttribute('data-task-id');
    toggleTaskStatus(taskId);
  } else if (target.classList.contains('delete-task')) {
    const taskId = target.getAttribute('data-task-id');
    deleteTask(taskId);
  } else if (target.classList.contains('edit-task')) {
    const taskId = target.getAttribute('data-task-id');
    editTask(taskId);
  }
});

// Evento de clique nos botões de filtro
allTasksButton.addEventListener('click', function() {
  showAllTasks();
});

completedTasksButton.addEventListener('click', function() {
  showCompletedTasks();
});

activeTasksButton.addEventListener('click', function() {
  showActiveTasks();
});

// Função para mostrar todas as tarefas
function showAllTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    taskItem.style.display = 'flex';
  });
}

// Função para mostrar apenas as tarefas concluídas
function showCompletedTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    const taskId = taskItem.getAttribute('data-task-id');
    const taskIndex = findTaskIndex(taskId);

    if (taskIndex !== -1 && tasks[taskIndex].completed) {
      taskItem.style.display = 'flex';
    } else {
      taskItem.style.display = 'none';
    }
  });
}

// Função para mostrar apenas as tarefas ativas (não concluídas)
function showActiveTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    const taskId = taskItem.getAttribute('data-task-id');
    const taskIndex = findTaskIndex(taskId);

    if (taskIndex !== -1 && !tasks[taskIndex].completed) {
      taskItem.style.display = 'flex';
    } else {
      taskItem.style.display = 'none';
    }
  });
}

// Função para adicionar uma nova tarefa à lista
function addTask(title, hours) {
  const taskId = Date.now().toString(); // Gera um ID único para a tarefa

  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  taskItem.setAttribute('data-task-id', taskId);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.setAttribute('data-task-id', taskId);

  const taskTitle = document.createElement('span');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = title;

  const taskHours = document.createElement('span');
  taskHours.classList.add('task-hours');
  taskHours.textContent = formatTaskHours(hours);

  const editIcon = document.createElement('i');
  editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-task');
  editIcon.setAttribute('data-task-id', taskId);

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-task');
  deleteIcon.setAttribute('data-task-id', taskId);

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskTitle);
  taskItem.appendChild(taskHours);
  taskItem.appendChild(editIcon);
  taskItem.appendChild(deleteIcon);

  taskList.appendChild(taskItem);

  tasks.push({
    id: taskId,
    title: title,
    hours: hours,
    completed: false
  });

  saveTasks(); // Salva as tarefas no armazenamento local
}

// Função para excluir uma tarefa
function deleteTask(taskId) {
  const taskIndex = findTaskIndex(taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    saveTasks(); // Salva as tarefas atualizadas no armazenamento local
    removeTaskFromDOM(taskId);
  }
}

// Função para editar uma tarefa
function editTask(taskId) {
  const taskIndex = findTaskIndex(taskId);

  if (taskIndex !== -1) {
    const newTitle = prompt('Digite o novo título da tarefa:');
    if (newTitle !== null) {
      tasks[taskIndex].title = newTitle.trim();
      saveTasks(); // Salva as tarefas atualizadas no armazenamento local
      updateTaskInDOM(taskId, newTitle);
    }
  }
}

// Função para encontrar o índice de uma tarefa no array de tarefas
function findTaskIndex(taskId) {
  return tasks.findIndex(function(task) {
    return task.id === taskId;
  });
}

// Função para remover uma tarefa do DOM
function removeTaskFromDOM(taskId) {
  const taskItem = taskList.querySelector(`li[data-task-id="${taskId}"]`);
  if (taskItem) {
    taskList.removeChild(taskItem);
  }
}

// Função para atualizar o título de uma tarefa no DOM
function updateTaskInDOM(taskId, newTitle) {
  const taskItem = taskList.querySelector(`li[data-task-id="${taskId}"]`);
  if (taskItem) {
    const taskTitle = taskItem.querySelector('.task-title');
    taskTitle.textContent = newTitle;
  }
}

// Função para formatar as horas da tarefa
function formatTaskHours(hours) {
  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;

  let formattedHours = '';

  if (days > 0) {
    formattedHours += days === 1 ? '1 dia' : `${days} dias`;
  }

  if (remainingHours > 0) {
    const separator = days > 0 ? ' e ' : '';
    formattedHours += separator + (remainingHours === 1 ? '1 hora' : `${remainingHours} horas`);
  }

  return formattedHours;
}

// Função para salvar as tarefas no armazenamento local
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do armazenamento local
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);

    // Renderiza as tarefas salvas no DOM
    tasks.forEach(function(task) {
      addTaskToDOM(task.id, task.title, task.hours, task.completed);
    });
  }
}

// Função para adicionar uma tarefa ao DOM
function addTaskToDOM(taskId, title, hours, completed) {
  taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('task-checkbox')) {
      updateFilter();
    }
  });

  // Substitua a função `updateFilter` pelo código abaixo

function updateFilter() {
  const filterOption = filterSelect.value;

  if (filterOption === 'all') {
    showAllTasks();
  } else if (filterOption === 'completed') {
    showCompletedTasks();
  } else if (filterOption === 'active') {
    showActiveTasks();
  }
}

// Adicione essas funções abaixo da função `updateFilter`

// Função para mostrar todas as tarefas
function showAllTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    taskItem.style.display = 'flex';
  });
}

// Função para mostrar apenas as tarefas concluídas
function showCompletedTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    const taskId = taskItem.getAttribute('data-task-id');
    const taskIndex = findTaskIndex(taskId);

    if (taskIndex !== -1 && tasks[taskIndex].completed) {
      taskItem.style.display = 'flex';
    } else {
      taskItem.style.display = 'none';
    }
  });
}

// Função para mostrar apenas as tarefas ativas (não concluídas)
function showActiveTasks() {
  taskList.querySelectorAll('.task-item').forEach(function(taskItem) {
    const taskId = taskItem.getAttribute('data-task-id');
    const taskIndex = findTaskIndex(taskId);

    if (taskIndex !== -1 && !tasks[taskIndex].completed) {
      taskItem.style.display = 'flex';
    } else {
      taskItem.style.display = 'none';
    }
  });
}

  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  taskItem.setAttribute('data-task-id', taskId);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.setAttribute('data-task-id', taskId);
  checkbox.checked = completed;

  const taskTitle = document.createElement('span');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = title;

  const taskHours = document.createElement('span');
  taskHours.classList.add('task-hours');
  taskHours.textContent = formatTaskHours(hours);

  const editIcon = document.createElement('i');
  editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-task');
  editIcon.setAttribute('data-task-id', taskId);

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-task');
  deleteIcon.setAttribute('data-task-id', taskId);

  taskItem.appendChild(checkbox);
  taskItem.appendChild(taskTitle);
  taskItem.appendChild(taskHours);
  taskItem.appendChild(editIcon);
  taskItem.appendChild(deleteIcon);

  taskList.appendChild(taskItem);
}

// Carrega as tarefas do armazenamento local ao carregar a página
loadTasks();
