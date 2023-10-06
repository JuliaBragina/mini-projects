const inputField = document.querySelector('.main__input--field');
const inputClues = document.querySelector('.main__input--clues');
const inputScore = document.querySelector('.main__input--score');
const startAgainButton = document.querySelector('.main__startAgain');
const userButton = document.querySelector('.main__buttonForm');

const buttonRange = document.querySelector('.main__buttonRange');

let computerNumber = 0;
let attempts = 0;
let inputMin = 1;
let inputMax = 100;

const resetGame = () => {
  computerNumber = guessNumber(inputMin, inputMax);
  document.querySelector('.main__minInput').value = inputMin;
  document.querySelector('.main__maxInput').value = inputMax;

  console.log(computerNumber);
  attempts = 0;
  inputClues.value = '';
  inputScore.value = '0';
  inputField.value = '';
};

const checkUserNumber = (userNumber) => {
  attempts++;

  if (isNaN(userNumber) || userNumber < inputMin || userNumber > inputMax) {
    inputClues.value = `Введите число от ${inputMin} до ${inputMax}`;
  } else {
    const hint = userNumber > computerNumber ? 'меньше' : 'больше';
    inputClues.value = `Загаданное число ${hint} вашего.`;
    inputScore.value = `${attempts}-я попытка!`;

    if (userNumber === computerNumber) {
      inputScore.value = `Вы угадали число с ${attempts} попытки!`;
      inputClues.value = '';
    }

    if (attempts % 3 === 0) {
      showEvenOddHint(hint);
    }
  }
};

const showEvenOddHint = (hint) => {
  const evenOdd = computerNumber % 2 === 0 ? 'четное' : 'нечетное';
  inputClues.value = `Загаданное число ${hint} вашего и ${evenOdd}.`;
  inputScore.value = `${attempts}-я попытка!`;
};

function guessNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setRange() {
  inputMin = parseInt(document.querySelector('#min').value);
  inputMax = parseInt(document.querySelector('#max').value);

  resetGame();
}

userButton.addEventListener('click', (event) => {
  event.preventDefault();
  const userNumber = parseInt(inputField.value);
  checkUserNumber(userNumber);
});

buttonRange.addEventListener('click', setRange);
startAgainButton.addEventListener('click', setRange);

resetGame();
