import React from 'react';
import Task from './Task'
import sortButton from '../assets/img/sort-svgrepo-com.svg';

function TodoList({data, onTaskDelete, onTaskDone, onTaskUpdate, onSortTasks}) {
  return (
    <div className="todoList">
      <div className='todoList__titleContainer'>
        <h2 className="todoList__title">INBOX</h2>
        <button type='button' className='todolist__sortButton' onClick={onSortTasks}><img className='todolist__sortButton' alt='кнопка сортировки' src={sortButton}></img></button>
      </div>
      <ul className="todoList__items">
        {
          data.map((task) => <Task key={task.id} task={task} onTaskDelete={onTaskDelete} onTaskDone={onTaskDone} onTaskUpdate={onTaskUpdate}/>)
        }
      </ul>
      <div className="todoList__completed">
        <h4 className="todoList__completed-title">ALL</h4>
        
          <p className="todoList__count">{data.length}</p>
       
      </div>
    </div>
  );
}

export default TodoList;