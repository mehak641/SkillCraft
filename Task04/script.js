document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDateTime = document.getElementById('taskDateTime');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        // Sort tasks by date and time
        tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id;
            if (task.completed) {
                listItem.classList.add('completed');
            }

            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            taskText.textContent = task.text;

            const taskDateTimeSpan = document.createElement('span');
            taskDateTimeSpan.classList.add('task-datetime');
            if (task.dateTime) {
                const date = new Date(task.dateTime);
                taskDateTimeSpan.textContent = `Due: ${date.toLocaleString()}`;
            } else {
                taskDateTimeSpan.textContent = 'No due date';
            }

            taskContent.appendChild(taskText);
            taskContent.appendChild(taskDateTimeSpan);

            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');

            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete');
            completeBtn.textContent = task.completed ? 'Uncomplete' : 'Complete';
            completeBtn.addEventListener('click', () => toggleCompleteTask(task.id));

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskActions.appendChild(completeBtn);
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);

            listItem.appendChild(taskContent);
            listItem.appendChild(taskActions);
            taskList.appendChild(listItem);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        const dateTime = taskDateTime.value;

        if (text === '') {
            alert('Task cannot be empty!');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text,
            dateTime,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskDateTime.value = '';
    }

    function toggleCompleteTask(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function editTask(id) {
        const taskToEdit = tasks.find(task => task.id === id);
        if (!taskToEdit) return;

        const newText = prompt('Edit task:', taskToEdit.text);
        if (newText !== null && newText.trim() !== '') {
            const newDateTime = prompt('Edit date and time (YYYY-MM-DDTHH:MM):', taskToEdit.dateTime);
            tasks = tasks.map(task =>
                task.id === id ? { ...task, text: newText.trim(), dateTime: newDateTime || '' } : task
            );
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    renderTasks();
});
