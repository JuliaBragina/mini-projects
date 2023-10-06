let flag = false;
const itemContainer = document.querySelector('.main__itemsContainer');
const button = document.querySelector('.header__addItemButton');
let buttonsEdit = null;
let buttonsDelete = null;
// Обработчик события для ввода текста в поле поиска
let filterValue = '';
// id продукта, который нужно обновить, из атрибута data-product-id
let selectedProductId = null;
const listTemplate = document.querySelector('#tempalate').content;

const popup = document.querySelector('.popup');
const popupEdit = document.querySelector('.popupEdit');
const popupProfile = document.querySelector('.popupProfile');

const popupClose = document.querySelector('.popup__closeButton');
const popupEditClose = document.querySelector('.popupEdit__closeButton');
const popupProfileClose = document.querySelector('.popupProfile__closeButton');

const popupAdd = document.querySelector('.popup__addButton');
const popupEditSave = document.querySelector('.popupEdit__addButton');

const buttonProfile = document.querySelector('.header__profileButton');
const popupSaveProfile = document.querySelector('.popupProfile__addButton');

const buttonItemUp = document.querySelector('.main__sortButtonCountUp');
const buttonItemDown = document.querySelector('.main__sortButtonCountDown');

const searchButton = document.querySelector('.main__searchButton');
const searchInput = document.querySelector('.main__searchInput');
const titleFood = document.querySelector('.main__titleFood');

const buttonTrend = document.querySelector('.header__graphsButton');
const popupTrend = document.querySelector('.popupVisual');
const closeTrend = document.querySelector('.popupVisual__closeButton');

buttonTrend.addEventListener('click', ()=> popupTrend.classList.add('popupVisual_is_visible'));
closeTrend.addEventListener('click', ()=> popupTrend.classList.remove('popupVisual_is_visible'));

//Закрыть форму добавления новых продуктов
popupClose.addEventListener('click', () => popup.classList.remove('popup_is_visible'));
popupEditClose.addEventListener('click', () => popupEdit.classList.remove('popupEdit_is_visible'));
popupProfileClose.addEventListener('click', () => popupProfile.classList.remove('popupProfile_is_visible'));

//Открыть форму добавления новых продуктов
button.addEventListener('click', () => popup.classList.add('popup_is_visible'));

//Открыть форму для редактирования
document.addEventListener('DOMContentLoaded', ()=> {
  if (document.querySelectorAll('.main__editItem')) {
    buttonsEdit = document.querySelectorAll('.main__editItem');
  }
  // Обработчик события для кнопки редактирования
  buttonsEdit.forEach(buttonEdit => buttonEdit.addEventListener('click', () => {
    popupEdit.classList.add('popupEdit_is_visible');
    let selectedProduct = buttonEdit.parentNode.parentNode.children;

    document.querySelector('.popupEdit__inputFood').value = selectedProduct[0].textContent;
    document.querySelector('.popupEdit__inputColorie').value = selectedProduct[1].textContent;

    //id выбранного продукта в переменной selectedProductId
    selectedProductId = buttonEdit.getAttribute('data-product-id');
  }));
});

//Добавить новый продукт в таблицу
popupAdd.addEventListener('click', (event) => {
  event.preventDefault();
  let prodObj = {};
  let massObjProd = JSON.parse(localStorage.getItem('items'));

  prodObj[document.querySelector('.popup__inputFood').id] = document.querySelector('.popup__inputFood').value;
  prodObj[document.querySelector('.popup__inputColorie').id] = document.querySelector('.popup__inputColorie').value;
  prodObj.id = Math.floor(Math.random() * (1000 - 1) + 1);

  if (massObjProd) {
    massObjProd.push(prodObj);
    localStorage.setItem('items', JSON.stringify(massObjProd));
    checkDataProfile();
  } else {
    let massObjProd = [];
    massObjProd.push(prodObj);
    localStorage.setItem('items', JSON.stringify(massObjProd));
  }

  showProducts();
  popup.classList.remove('popup_is_visible');
});

// Обработчик события для ввода текста в поле поиска
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const searchValue = searchInput.value.toLowerCase(); // Получаем введенное значение и преобразуем в нижний регистр
    let productsData = JSON.parse(localStorage.getItem('items'));
    // Фильтруем продукты на основе исходных данных
    const filteredProducts = productsData.filter(product => product.food.toLowerCase().includes(searchValue));

    // Отображаем отфильтрованные продукты
    displayProducts(filteredProducts);
  }
});

searchButton.addEventListener('click', () => {
  searchInput.classList.toggle('visible');
  titleFood.classList.toggle('hidden');
  
  if (searchInput.classList.contains('visible')) {
    searchInput.focus();
  } else {
    searchInput.blur();
  }
});

//показать все продукты из хранилища
function showProducts() {
  let massObjProd = JSON.parse(localStorage.getItem('items'));
  itemContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых продуктов
  if (massObjProd) {
    massObjProd.forEach(element => {
      const listElement = listTemplate.querySelector('.tempalate').cloneNode(true);
      listElement.querySelector('.main__titleFood').textContent = element.food;
      listElement.querySelector('.main__titleCalorie').textContent = element.calorie;
      listElement.querySelector('.main__titleFood').setAttribute('data-product-id', element.id);
      listElement.querySelector('.main__editItem').setAttribute('data-product-id', element.id);
      listElement.querySelector('.main__deleteItem').setAttribute('data-product-id', element.id);
      itemContainer.append(listElement);
    });
  }
  flag = false;
}

// Функция для отображения списка продуктов на странице
function displayProducts(products) {
  itemContainer.innerHTML = ''; // Очищаем контейнер перед отображением

  products.forEach(product => {
    const listElement = listTemplate.querySelector('.tempalate').cloneNode(true);
    listElement.querySelector('.main__titleFood').textContent = product.food;
    listElement.querySelector('.main__titleCalorie').textContent = product.calorie;
    itemContainer.append(listElement);
  });
}

// Обработчик события для кнопки сохранения редактированных данных
popupEditSave.addEventListener('click', () => {
  if (selectedProductId !== null) {
    // Получение данных выбранного продукта из формы редактирования
    const updatedProduct = {
      food: document.querySelector('.popupEdit__inputFood').value,
      calorie: document.querySelector('.popupEdit__inputColorie').value,
    };

    // Обновляем продукт по его id
    updateProduct(selectedProductId, updatedProduct);

    // Сбросываем значение selectedProductId после обновления
    selectedProductId = null;

    popupEdit.classList.remove('popupEdit_is_visible');
  }
});

// Функция для обновления продукта по его id
function updateProduct(productId, updatedProductData) {
  const productList = JSON.parse(localStorage.getItem('items'))
  if (!productList || !productId) {
    return;
  }

  // Найдем индекс продукта с соответствующим id
  const productIndex = productList.findIndex(product => product.id === parseFloat(productId));
  console.log(productIndex)

  if (productIndex !== -1) {
    // Если продукт с указанным id найден, обновим его данные
    productList[productIndex].food = updatedProductData.food;
    productList[productIndex].calorie = updatedProductData.calorie;

    // Сохраняем обновленный список продуктов в хранилище
    localStorage.setItem('items', JSON.stringify(productList));
  }
}

//Удаление продукта из таблицы
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.main__deleteItem').forEach(buttonDelete => buttonDelete.addEventListener('click', () => {
    let productList = JSON.parse(localStorage.getItem('items'));
    const productId = buttonDelete.getAttribute('data-product-id');
    if (!productList || !productId) {
      return;
    }

    // Найдем индекс продукта с соответствующим id
    const productIndex = productList.findIndex(product => product.id === parseFloat(productId));

    if (productIndex !== -1) {
      // Если продукт с указанным id найден, то удаляем
     productList.splice(productIndex, 1);      
     console.log(productList)
      // Сохраняем обновленный список продуктов в хранилище
      localStorage.setItem('items', JSON.stringify(productList));
      showProducts();
    }
  }))
});

//Ввести данные пользователя
buttonProfile.addEventListener('click', ()=> {
  popupProfile.classList.add('popupProfile_is_visible');
  let massObjProd = JSON.parse(localStorage.getItem('profileName'));

  if (massObjProd) {
    document.querySelector('.popupProfile__inputName').value = massObjProd.name;
    document.querySelector('.popupProfile__inputGCount').value = massObjProd.gCount;
  } else {
    console.log('Заполните поля!');
  }
})

//Сохранение данных пользователя
popupSaveProfile.addEventListener('click', ()=> {
  let profileObj = {};
  let massObjProd = JSON.parse(localStorage.getItem('profileName'));

  if (massObjProd) {
    profileObj = {
      name: document.querySelector('.popupProfile__inputName').value,
      gCount: document.querySelector('.popupProfile__inputGCount').value
    }
    localStorage.setItem('profileName', JSON.stringify(profileObj));
  } else {
    profileObj[document.querySelector('.popupProfile__inputName').id] = document.querySelector('.popupProfile__inputName').value;
    profileObj[document.querySelector('.popupProfile__inputGCount').id] = document.querySelector('.popupProfile__inputGCount').value;
    localStorage.setItem('profileName', JSON.stringify(profileObj));
  }

  popupProfile.classList.remove('popupProfile_is_visible');
})


// Функция для сортировки данных по указанному полю
buttonItemUp.addEventListener('click', ()=> {
  if(flag) {
    showProducts();
  } else {
    
    let massForSort = JSON.parse(localStorage.getItem('items'));

    massForSort.sort((a, b) => {
      const calorieA = parseFloat(a.calorie);
      const calorieB = parseFloat(b.calorie);
      return calorieA - calorieB;
    });

    // Очистка контейнера перед добавлением отсортированных элементов
    itemContainer.innerHTML = '';
    
    // Добавляем отсортированные элементы обратно в контейнер
    massForSort.forEach(element => {
      const listElement = listTemplate.querySelector('.tempalate').cloneNode(true);
      listElement.querySelector('.main__titleFood').textContent = element.food;
      listElement.querySelector('.main__titleCalorie').textContent = element.calorie;
      itemContainer.append(listElement);
    });
    flag = true;
  }
})

// Функция для сортировки данных по указанному полю
buttonItemDown.addEventListener('click', ()=> {
  if(flag) {
    showProducts();
  } else {
    let massForSort = JSON.parse(localStorage.getItem('items'));

    massForSort.sort((a, b) => {
      const calorieA = parseFloat(a.calorie);
      const calorieB = parseFloat(b.calorie);
      return calorieB - calorieA;
    });

    // Очистка контейнера перед добавлением отсортированных элементов
    itemContainer.innerHTML = '';
    
    // Добавление отсортированных элементов обратно в контейнер
    massForSort.forEach(element => {
      const listElement = listTemplate.querySelector('.tempalate').cloneNode(true);
      listElement.querySelector('.main__titleFood').textContent = element.food;
      listElement.querySelector('.main__titleCalorie').textContent = element.calorie;
      itemContainer.append(listElement);
    });
    flag = true;
  }
})

//Проверка наличия данных пользователя для проверки лимита калорий за день
function checkDataProfile() {
  let massObjProd = JSON.parse(localStorage.getItem('profileName'));

  if(massObjProd) {
    showProducts();

    //Подсчет калорий за день
    let totalCount = 0;
    const countCalories = document.querySelectorAll('.main__countCalorie');
    const totalCalories = document.querySelector('.footer__titleCalorie');
    countCalories.forEach(element => totalCount += parseFloat(element.textContent));

    localStorage.setItem('totalCount', totalCount);
    totalCalories.textContent = totalCount;

    if(totalCount > massObjProd.gCount) {
      console.log('Превышен лимит');
    }

  } else {
    localStorage.clear();
    console.log('Нет данных профиля!')
  }
}

checkDataProfile();