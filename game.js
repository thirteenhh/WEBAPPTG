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
  return rarities[0].type; // запасной вариант
}

// 🃏 Функция выбора случайной карточки
function getRandomCard() {
  const rarity = getRandomRarity();

  // ⚙️ Укажи реальное количество карточек каждой редкости!
  const totalCards = {
    kal: 8, // kal1.png — kal8.png
    def: 10 // def1.png — def10.png
  };

  // Если вдруг нет такой редкости — безопасный возврат
  if (!totalCards[rarity]) {
    console.error("❌ Неизвестная редкость:", rarity);
    return { rarity: "kal", image: "img/kal1.png" };
  }

  const maxNum = totalCards[rarity];
  const randomNum = Math.floor(Math.random() * maxNum) + 1;
  const imagePath = `img/${rarity}${randomNum}.png`;

  console.log(`Выпала карта: ${rarity}${randomNum}.png`);
  return { rarity, image: imagePath };
}

// 🧭 Telegram API
const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

// 🧩 Когда страница готова
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const menuButtons = document.querySelectorAll('.menuBtn');

  // 💥 Открытие кейса
  openBtn.addEventListener("click", () => {
    const card = getRandomCard();

    // Если по какой-то причине картинка не найдена
    if (!card || !card.image) {
      display.innerHTML = `<p style="color:red;">Ошибка: карточка не найдена</p>`;
      return;
    }

    display.innerHTML = `
      <img src="${card.image}" 
           alt="${card.rarity}" 
           style="width:200px;height:auto;border-radius:12px;">
    `;
  });

  // 🔘 Переключение активной вкладки меню
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
