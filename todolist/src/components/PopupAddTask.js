import React from 'react';
import closeButton from '../assets/img/closeButtonBlack.svg'

function PopupAddTask({isOpen, isUpdateOpen, taskForUpdate, onClose, onAddTask, onTaskUpdate}) {
  React.useEffect(() => {
    if (taskForUpdate) {
      setTask(taskForUpdate.task || "");
      setTime(taskForUpdate.time || "");
      setDescription(taskForUpdate.description || "");
    } else {
      setTask("");
      setTime("");
      setDescription("");
    }
  }, [isOpen, taskForUpdate]);

   // Стейт, в котором содержится значение инпута
  const [task, setTask] = React.useState('');
  const [time, setTime] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Обработчик изменения инпута обновляет стейт
  function handleChangeTask(e) {
    setTask(e.target.value);
  }

  function handleChangeTime(e) {
    setTime(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    const updatedTask = {
      task: task,
      time: time,
      description: description,
      done: false, // По умолчанию задача не выполнена
    };
  
    if (isUpdateOpen) {
      // Если редактируется существующая задача, передаем id и обновленные данные
      onTaskUpdate(taskForUpdate.id, updatedTask);
    } else {
      // Если это новая задача, добавим ее
      onAddTask(updatedTask);
    }
  }
  
  return (
    <div className={`popupAddTask ${(isOpen || isUpdateOpen) && "popupAddTask_is_opened"}`}>
      <div className="popupAddTask__content">
        <button type="button" className="popupAddTask__buttonClose" onClick={onClose}><img  className='popupAddTask__buttonImg' src={closeButton} alt='close button'></img></button>
        <form name="add-form" className="popupAddTask__form" noValidate>
          <h4 className="popupAddTask__title">
          {
              isUpdateOpen ? 'Обновить задачу' : 'Добавить новую задачу'
            }
            
          </h4>
          <section className="popupAddTask__section">
            <input id="name-input" type="text" name="task" value={task || ""} onChange={handleChangeTask} className="popupAddTask__input" placeholder="What do you want to do?" required minLength="2" maxLength="40" autoComplete="off" />
            <input id="name-input" type="date" name="task" value={time  || ""} onChange={handleChangeTime} className="popupAddTask__input" placeholder="Срок" vrequired minLength="2" maxLength="40" autoComplete="off" />
            <input id="name-input" type="text" name="task" value={description  || ""} onChange={handleChangeDescription} className="popupAddTask__input" placeholder="Описание" required minLength="2" maxLength="40" autoComplete="off" />
          </section>
          <button type="submit" className="popupAddTask__buttonAdd" onClick={handleSubmit} >
            {
              isUpdateOpen ? "Обновить" : "Добавить"
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupAddTask;
