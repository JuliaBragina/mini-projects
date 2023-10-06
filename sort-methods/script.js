const barsContainer = document.querySelector('.bars');
const startButton = document.querySelector('#startBtn');
const stopButton = document.querySelector('#stopBtn');
const sortingMethodSelect = document.querySelector('#sortingMethod');

let stopSort = false;
const inputArray = document.querySelector('#inputArray');

function generateRandomArray(length, min, max) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return array;
}

function createBars(array) {
  const max = Math.max(...array);
    for (let value of array) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${(value / max) * 100}%`;
      barsContainer.appendChild(bar);
    }
}

async function swapBars(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
  await new Promise(resolve => setTimeout(resolve, 50));
}

//Сортировка пузырьком
async function bubbleSort(data) {
  for (let i = 0; i + 1 < data.length; i++) {
    for (let j = 0; j + 1 < data.length; j++) {
      if (data[j + 1] < data[j]) {
        await swapBars(barsContainer.children[j + 1], barsContainer.children[j]);
        [data[j + 1], data[j]] = [data[j], data[j + 1]];

        if(stopSort === true) {
          return;
        }
      }
    }
  }
}

//Шейкер
async function shaker(data) {
  if (data.length == 0) {
    return;
  }
  let left = 0, right = data.length - 1;
  while (left <= right) {
    for (let i = right; i > left; --i) { //проход справа налево
      if (data[i-1] > data[i]) {
        await swapBars(barsContainer.children[i - 1], barsContainer.children[i]);
        [data[i-1], data[i]] = [data[i], data[i-1]];
        
        if(stopSort === true) {
          return;
        }
      }
    }
    left++;
    for (let i = left; i < right; ++i) { //проход слева направо
      if (data[i] > data[i + 1]) {
        [data[i], data[i+1]] = [data[i+1], data[i]];
        await swapBars(barsContainer.children[i], barsContainer.children[i + 1]);

        if(stopSort === true) {
          return;
        }
      }
    }
    right--;
  }
}

//Сортировка вставками
async function insertion(data) {
  for (let i = 1; i < data.length; i++) { //первый элемент считается уже отсортированным
    let x = data[i]; //сохраняем текущие значения
    let j = i;
    while (j > 0 && data[j - 1] > x) { //цикл выполняется для перемещения элемента x на правильное место в уже отсортированной части массива
      await swapBars(barsContainer.children[j], barsContainer.children[j-1]);
      data[j] = data[j - 1];
      --j;

      if(stopSort === true) {
        return;
      }
    }
    data[j] = x; //элемент x помещается на свое правильное место в отсортированной части массива data
  }
}

//Сортировка выбором
function findMinElement(data, l, r) {
  let min = data[l], res = l;
  for (let i = l + 1; i < r; i++) {
    if (data[i] < min) {
      res = i;
      min = data[i];
    }
  }
  return res;
}
 
async function selection(data) {
  for (let i = 0; i < data.length; i++) {
    let j = findMinElement(data, i, data.length);
    await swapBars(barsContainer.children[i], barsContainer.children[j]);
    [data[i], data[j]] = [data[j], data[i]];

    if(stopSort === true) {
      return;
    }
  }
}

//Быстрая сортировка
async function partition(data, l, r) {
  let x = data[r];
  let less = l;
 
  for (let i = l; i < r; i++) {
    if (data[i] <= x) {
      await swapBars(barsContainer.children[i], barsContainer.children[less]);
      [data[i], data[less]] = [data[less], data[i]];
      less++;

      if(stopSort === true) {
        return;
      }
    }
  }
  await swapBars(barsContainer.children[r], barsContainer.children[less]);
  [data[r], data[less]] = [data[less], data[r]];
  return less;
}
 
async function quickSortImpl(data, l, r) {
  if (l < r) {
    let q = await partition(data, l, r);
    quickSortImpl(data, l, q - 1);
    quickSortImpl(data, q + 1, r);
  }
}

async function quick(data) {
  if (data.length > 0) {
    quickSortImpl(data, 0, data.length - 1);
  }
}

// Обработчик кнопки "Stop"
stopButton.addEventListener('click', () => {
  stopSort = true;
});

startButton.addEventListener('click', async () => {
  const arrayLength = 50;
  const minValue = 10;
  const maxValue = 200;
  const selectedMethod = sortingMethodSelect.value;

  barsContainer.innerHTML = '';

  let array;

  if (inputArray.value) {
    // Если пользователь ввел массив в поле ввода, используем его
    array = inputArray.value.split(' ').map(Number);
  } else {
    // В противном случае, генерируем случайный массив
    array = generateRandomArray(arrayLength, minValue, maxValue);
  }
  
  createBars(array);

  if (selectedMethod === 'bubbleSort') {
    stopSort = false;
    await bubbleSort(array);
  } else if (selectedMethod === 'shakerSort') {
    stopSort = false;
    await shaker(array);
  } else if (selectedMethod === 'insertionSort') {
    stopSort = false;
    await insertion(array);
  } else if (selectedMethod === 'selectionSort') {
    stopSort = false;
    await selection(array);
  } else if (selectedMethod === 'quickSort') {
    stopSort = false;
    await quick(array);
  }
});