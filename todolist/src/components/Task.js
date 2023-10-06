import React from 'react';
import sunImage from '../assets/img/sun.svg';
import deleteButtonImage from '../assets/img/deleteButton.svg';
import editTextImage from '../assets/img/edit-text.svg';
import doneButtonImage from '../assets/img/done-button.svg';

function Task({task , onTaskDelete, onTaskDone, onTaskUpdate}) {
  return (
    <li className={`todoList__item ${task.done && "todoList__item_done"}`}>
      <section className="todoList__description">
        <img className="todoList__img" src={sunImage} alt='logo' />
        <div className='todoList__descriptionBox'>
          <h3 className="todoList__item-title">{task.task}</h3>
          <p className="todoList__paragrahp">{task.time}</p>
          <p className="todoList__paragrahp">{task.description}</p>
        </div>
      </section>
      <div className="todoList__buttons">
        <button className='todoList__button' onClick={_ => onTaskDelete(task.id)}  disabled={task.done}><img className="todoList__buttonImg" src={deleteButtonImage} alt="Удалить" /></button>
        <button className='todoList__button' onClick={_ => onTaskDone(task.id)}  disabled={task.done}><img className="todoList__buttonImg" src={doneButtonImage} alt="Сделано" /></button>
        <button className='todoList__button' onClick={_ => onTaskUpdate(task)}  disabled={task.done}><img className="todoList__buttonImg" src={editTextImage} alt="Редактировать" /></button>
      </div>
    </li>
  );
}

export default Task;

