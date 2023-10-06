import React from 'react';
import Header from './Header';
import TodoList from './Todolist';
import PopupAddTask from './PopupAddTask';

import { useState, useEffect } from 'react';

function App() {
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setUpdatePopupOpen] = useState(false);
  const [taskForUpdate, setTaskForUpdate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const tasksLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    if (tasksLocalStorage) {
      setTasks(tasksLocalStorage);
      setSortedTasks(tasksLocalStorage);

      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const tasksLocalStorage = JSON.parse(localStorage.getItem('tasks'));
    if (tasksLocalStorage) {
      setTasks(tasksLocalStorage);
      setSortedTasks(tasksLocalStorage);
    }
  }, [isAddPopupOpen, isUpdatePopupOpen]);

  function handleAddTaskClick() {
    setAddPopupOpen(true);
  }

  function handleUpdateTaskClick(task) {
    setUpdatePopupOpen(true);
    setTaskForUpdate(task);
  }
  
  function handleAddTask(newTask) {
    newTask.id = Math.floor(Math.random() * (1000 - 1) + 1);
    newTask.done = false;
    const updatedTasks = [newTask, ...tasks];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
    handleCloseButton();
  }
  
  function handleTaskDelete(idTask) {
    setTasks(cards => cards.filter(c => c.id != idTask));
  }

  function handleTaskDone(idTask) {
    setTasks((state) =>
      state.map((task) => (task.id === idTask ? { ...task, done: true } : task))
    );
    setTasks((updatedTasks) => {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }

  function handleTaskUpdate(id, updatedTask) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
  
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    handleCloseButton();
  }
  
  function handleCloseButton() {
    setAddPopupOpen(false);
    setUpdatePopupOpen(false);
  }

  function sortByDate(a, b) {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
 
    // Сравниваем даты и возвращаем результат сортировки
    if (dateA < dateB) {
      return -1;
    }
    if (dateA > dateB) {
      return 1;
    }
    return 0;
  }
  
  function handlerSortTasks() {
    if (sorted) {
      // Если массив уже отсортирован, вернем к исходному массиву
      setTasks([...sortedTasks]);
    } else {
      // Если массив не отсортирован, отсортируем его по дате
      const sortedTasks = [...tasks].sort(sortByDate);
      setTasks(sortedTasks);
    }
    setSorted(!sorted);
  }
  
  // Проверка задач на приближение к сроку выполнения и отправка уведомлений
function checkTasksForNotifications() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));

  if (!tasks) return;

  const now = new Date();

  tasks.forEach(task => {
    const dueDate = new Date(task.time);

    // Вычисляем разницу между текущей датой и сроком выполнения задачи
    const timeUntilDue = dueDate - now;

    // Если срок выполнения задачи приближается (менее чем за 24 часа), отправляем уведомление
    if (timeUntilDue > 0 && timeUntilDue <= 24 * 60 * 60 * 1000 && task.done === false) {
      sendNotification(`Срок выполнения задачи "${task.task}" близок!`);
    }
  });
}

function sendNotification(message) {
  // Проверяем, поддерживаются ли уведомления
  if ('Notification' in window) {
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          new Notification(message);
        }
      })
      .catch(error => {
        console.error('Ошибка при запросе разрешения на уведомления:', error);
      });
  } else {
    console.error('Уведомления не поддерживаются в этом браузере');
  }
}

// Запуск проверки задач на приближение к сроку выполнения (каждые 5 минут)
setInterval(checkTasksForNotifications, 5 * 60 * 1000);

  return (
    <div className="App">
      <Header onAddTask={handleAddTaskClick} />
      <main className="content">
        <TodoList data={tasks} onTaskDelete={handleTaskDelete} onTaskDone={handleTaskDone} onTaskUpdate={handleUpdateTaskClick} onSortTasks={handlerSortTasks}/>
      </main>

      <PopupAddTask isOpen={isAddPopupOpen} isUpdateOpen={isUpdatePopupOpen} taskForUpdate={taskForUpdate} onClose={handleCloseButton} onAddTask={handleAddTask} onTaskUpdate={handleTaskUpdate}/>
    </div>
    
  );
}

export default App;