// 🎴 Настройка шансов выпадения редкостей
const rarities = [
  { type: "kal", chance: 70 }, // говно
  { type: "def", chance: 30 }  // обычная
];

// 🎲 Функция выбора случайной редкости
function getRandomRarity() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (const r of rarities) {
    sum += r.chance;
    if (rand <= sum) return r.type;
  }
  return rarities[0].type; // на всякий случай, если что-то пойдёт не так
}

// 🃏 Функция выбора случайной карточки
function getRandomCard() {
  const rarity = getRandomRarity();

  // Количество файлов каждой редкости (укажи реальное число)
  const totalCards = {
    kal: 8, // kal1.png - kal8.png
    def: 10 // def1.png - def10.png
  };

  const maxNum = totalCards[rarity];
  const randomNum = Math.floor(Math.random() * maxNum) + 1;
  return {
    rarity,
    image: `img/${rarity}${randomNum}.png`
  };
}

// 🧭 Telegram API
const tg = window.Telegram.WebApp;
tg.ready(); // говорит Telegram, что игра загрузилась
console.log(tg.initDataUnsafe?.user); // безопасно логируем пользователя

// 🔄 Проверка ориентации экрана
if (window.innerHeight < window.innerWidth) {
  alert("Пожалуйста, переверните устройство в портретный режим");
}

// 🧩 Когда страница готова
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const menuButtons = document.querySelectorAll('.menuBtn');

  // 💥 Открытие кейса
  openBtn.addEventListener("click", () => {
    const card = getRandomCard();
    display.innerHTML = `<img src="${card.image}" alt="${card.rarity}" style="width:200px;height:auto;border-radius:12px;">`;
  });

  // 🔘 Переключение активной вкладки меню
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
