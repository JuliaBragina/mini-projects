const imageInput = document.querySelector('.main__inputSave');
const canvas = document.querySelector('.main__canvas');
const topTextInput = document.querySelector('.main__inputAdd');
const addTextButton = document.querySelector('.main__buttonAdd');
const saveButton = document.querySelector('.main__buttonSave');
const ctx = canvas.getContext('2d');

let textElements = []; // Массив для хранения текстовых элементов

// Флаг для отслеживания перемещения
let isDragging = false;

const textColorInput = document.querySelector('.main__inputColor');

// Загрузка изображения
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(file);
});

// Добавление текста
addTextButton.addEventListener('click', () => {
  const topText = topTextInput.value;
  // Настройки стиля текста
  const textStyle = {
    fontSize: '30px',
    fontFamily: 'Arial',
    fillStyle:  textColorInput.value,
    textAlign: 'center'
  };

  textElements.push({
    topText,
    style: textStyle,
    x: canvas.width / 2, // Начальные координаты для текстового элемента
    y: 50,
    width: 0,
    height: 0
  });

  topTextInput.value = '';

  // После добавления текстового элемента перерисуем холст
  redrawCanvas();
});

function drawTextElements() {
  textElements.forEach(({ topText, style, x, y }) => {
    ctx.font = style.fontSize + ' ' + style.fontFamily;
    ctx.fillStyle = style.fillStyle;
    ctx.textAlign = style.textAlign;

    // Измерим размеры текста
    const textWidth = ctx.measureText(topText).width;
    const textHeight = parseInt(style.fontSize, 10);

    // Создадим подложку вокруг текста
    ctx.strokeStyle = 'red'; // Цвет рамки (можете выбрать другой цвет)
    ctx.lineWidth = 2; // Ширина рамки (можете выбрать другую ширину)
    ctx.strokeRect(x - textWidth / 2, y - textHeight / 2, textWidth, textHeight);
    // Рисуем текст
    ctx.fillText(topText, x, y);
  });
}

// Перерисовать весь холст
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Перерисовать изображение (если оно есть)
  if (imageInput.files[0]) {
    const img = new Image();
    img.src = URL.createObjectURL(imageInput.files[0]);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawTextElements(); // Перерисовать текстовые элементы поверх изображения
    };
  } else {
    drawTextElements(); // Просто перерисовать текстовые элементы (без изображения)
  }
}

// Сохранение мема
saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

canvas.addEventListener('mousedown', (e) => {
  // Обработчик начала перемещения
    
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Проверяем, если курсор находится над текстовыми элементами и начинаем перемещение первого найденного элемента
  for (let i = 0; i < textElements.length; i++) {
    const element = textElements[i];
        
    // Вычисляем размеры текста с учетом текущего шрифта и координаты центра текста
    const textWidth = ctx.measureText(element.topText).width;
    const textHeight = parseInt(element.style.fontSize, 10);

    // Проверяем, если курсор находится внутри границ текстового элемента
    if (
      mouseX >= element.x - textWidth / 2 &&
      mouseX <= element.x + textWidth / 2 &&
      mouseY >= element.y - textHeight / 2 &&
      mouseY <= element.y + textHeight / 2
    ) {
      // Начинаем перемещение этого элемента
      element.isDragging = true;
      element.startX = mouseX;
      element.startY = mouseY;
      break; // Завершаем цикл, чтобы не начать перемещение других элементов
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  // Проверим, есть ли активный перемещаемый элемент
  const draggedElement = textElements.find((element) => element.isDragging);

  if (draggedElement) {
    // Вычислим разницу между текущими координатами и начальными координатами
    const dx = mouseX - draggedElement.startX;
    const dy = mouseY - draggedElement.startY;

    // Обновим начальные координаты для следующего шага перемещения
    draggedElement.startX = mouseX;
    draggedElement.startY = mouseY;

    // Обновим координаты текстового элемента
    draggedElement.x += dx;
    draggedElement.y += dy;

    // После обновления координат элемента перерисуем холст
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  // Сбросим флаг перемещения для всех элементов
  textElements.forEach((element) => {
    element.isDragging = false;
  });
});