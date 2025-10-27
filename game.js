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
  return rarities[0].type; // fallback
}

// 🃏 Функция выбора случайной карточки
function getRandomCard() {
  const rarity = getRandomRarity();

  // Укажи реальное количество карт каждой редкости
  const totalCards = {
    kal: 8, // kal1.png — kal8.png
    def: 10 // def1.png — def10.png
  };

  const maxNum = totalCards[rarity] || 1; // на случай ошибки
  const randomNum = Math.floor(Math.random() * maxNum) + 1;
  const imagePath = `img/${rarity}${randomNum}.png`;

  console.log(`🎴 Выпала карта: ${rarity}${randomNum}.png`);

  return {
    rarity,
    image: imagePath
  };
}

// 🧭 Telegram WebApp API
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
}

// 🧩 Основная логика игры
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const menuButtons = document.querySelectorAll('.menuBtn');

  // 💥 Открытие кейса
  openBtn.addEventListener("click", () => {
    const card = getRandomCard();

    if (!card || !card.image) {
      display.innerHTML = `<p style="color:red;">Ошибка: карточка не найдена</p>`;
      return;
    }

    // Показываем картинку
    display.innerHTML = `
      <img src="${card.image}" 
           alt="${card.rarity}" 
           style="width:200px;height:auto;border-radius:12px;">
      <p style="margin-top:10px;font-weight:bold;">
        Выпала: ${card.rarity.toUpperCase()}
      </p>
    `;
  });

  // 🔘 Активные вкладки меню
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
