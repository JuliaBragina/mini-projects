import React from 'react';
import background from '../assets/img/background.jpeg';
import addTaskButton from '../assets/img/add-button.svg';

function Header({onAddTask}) {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  return (
    <header className="header">
      <img className="header__background" src={background} alt="Background" />
      <section className="header__section">
        <div className="header__container">
          <h1 className="header__title">TODO List</h1>
          <button type="button" className="header__buttonAdd" onClick={onAddTask}><img className='header__buttonImg' src={addTaskButton} alt='add task'></img></button>
        </div>
        <time className="header__time" dateTime="2023-04-05">{day}.{month}.{year}</time>
      </section>
    </header>
  );
}

export default Header;
