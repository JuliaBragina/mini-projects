const caloriesByFood = {};
const data = JSON.parse(localStorage.getItem('items'));

const ctx = document.getElementById('myPieChart').getContext('2d');

data.forEach(item => {
  const food = item.food;
  const calorie = item.calorie;

  if (caloriesByFood[food]) {
    caloriesByFood[food] += calorie;
  } else {
    caloriesByFood[food] = calorie;
  }
});

const pieData = {
  labels: Object.keys(caloriesByFood), // Названия продуктов
  datasets: [{
    data: Object.values(caloriesByFood), // Количество калорий для каждого продукта
    backgroundColor: ['red', 'blue', 'green'],
  }]
};

const myPieChart = new Chart(ctx, {
  type: 'pie', // Тип диаграммы (круговая)
  data: pieData, // Данные
});