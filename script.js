let balance = 1000;
const minBet = 50;
const maxBet = balance;
let currentAngle = 0; // Текущий угол колеса (начальное положение)

const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin');
const balanceDisplay = document.getElementById('balance');
const betType = document.getElementById('bet-type');
const betValue = document.getElementById('bet-value');
const numberInput = document.getElementById('number-input');
const colorInput = document.getElementById('color-input');
const evenOddInput = document.getElementById('even-odd-input');
const resultDisplay = document.getElementById('result');

// Показать нужные поля в зависимости от типа ставки
betType.addEventListener('change', () => {
  numberInput.classList.add('hidden');
  colorInput.classList.add('hidden');
  evenOddInput.classList.add('hidden');

  if (betType.value === 'number') numberInput.classList.remove('hidden');
  if (betType.value === 'color') colorInput.classList.remove('hidden');
  if (betType.value === 'even-odd') evenOddInput.classList.remove('hidden');
});

// Логика вращения рулетки
spinButton.addEventListener('click', () => {
  if (balance < minBet) {
    resultDisplay.textContent = 'Недостаточно кредитов для игры!';
    spinButton.disabled = true;
    return;
  }

  const bet = parseInt(betValue.value);
  if (isNaN(bet) || bet < minBet || bet > maxBet || bet > balance) {
    resultDisplay.textContent = `Ставка должна быть числом от ${minBet} до ${maxBet} и не больше баланса!`;
    return;
  }

  let userBet;
  if (betType.value === 'number') {
    userBet = parseInt(document.getElementById('number-value').value);
    if (isNaN(userBet) || userBet < 0 || userBet > 11) {
      resultDisplay.textContent = 'Число должно быть от 0 до 11!';
      return;
    }
  } else if (betType.value === 'color') {
    userBet = document.getElementById('color-value').value;
    if (!userBet) {
      resultDisplay.textContent = 'Выберите цвет!';
      return;
    }
  } else if (betType.value === 'even-odd') {
    userBet = document.getElementById('even-odd-value').value;
    if (!userBet) {
      resultDisplay.textContent = 'Выберите чет или нечет!';
      return;
    }
  }

  // Случайный угол вращения
  const degreesPerSector = 360 / 12; // 30°
  const randomSpin = 1080 + Math.random() * 360; // количество оборотов
  const finalAngle = currentAngle + randomSpin; // Учитываем текущее положение

  // Анимация вращения
  wheel.style.transition = 'transform 3s ease-out';
  wheel.style.transform = `rotate(${finalAngle}deg)`;
  spinButton.disabled = true;
  resultDisplay.textContent = 'Рулетка крутится...';

  setTimeout(() => {
    // Обновляем текущее положение колеса
    currentAngle = finalAngle % 360; // Нормализуем угол до 0–360°
    if (currentAngle < 0) currentAngle += 360; // Учитываем отрицательные значения

    // Определяем сектор под стрелкой
    const sectorIndex = Math.ceil(currentAngle / degreesPerSector) % 12;

    // Порядок чисел и цветов синхронизирован с conic-gradient и HTML
    // const numbers = [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const colors = [
      'зеленое',  // 0°–30°
      'красное',  // 30°–60°
      'черное',   // 60°–90°
      'красное',  // 90°–120°
      'черное',   // 120°–150°
      'красное',  // 150°–180°
      'черное',   // 180°–210°
      'красное',  // 210°–240°
      'черное',   // 240°–270°
      'красное',  // 270°–300°
      'черное',   // 300°–330°
      'красное'   // 330°–360°
    ];
    const resultNumber = sectorIndex; // numbers[sectorIndex];
    const color = colors[sectorIndex];

    let win = false;
    let winnings = 0;
    if (betType.value === 'number' && userBet === resultNumber) {
      winnings = bet * 11;
      win = true;
    } else if (betType.value === 'color' && userBet === color) {
      winnings = bet * 2;
      win = true;
    } else if (betType.value === 'even-odd') {
      if (userBet === 'чет' && resultNumber % 2 === 0 && resultNumber !== 0) {
        winnings = bet * 2;
        win = true;
      } else if (userBet === 'нечет' && resultNumber % 2 !== 0) {
        winnings = bet * 2;
        win = true;
      }
    }

    if (win) {
      balance += winnings - bet;
      resultDisplay.textContent = `Выпало: ${resultNumber} (${color}). Вы выиграли ${winnings} кредитов!`;
    } else {
      balance -= bet;
      resultDisplay.textContent = `Выпало: ${resultNumber} (${color}). Вы проиграли.`;
    }

    balanceDisplay.textContent = balance;
    spinButton.disabled = false;

    if (balance < minBet) {
      resultDisplay.textContent += ' У вас недостаточно кредитов для игры!';
      spinButton.disabled = true;
    }
  }, 3000);
});

// Инициализация
balanceDisplay.textContent = balance;
wheel.style.transform = `rotate(${currentAngle}deg)`; // Устанавливаем начальное положение