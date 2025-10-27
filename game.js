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
  return rarities[0].type;
}

// 🃏 Функция выбора случайной карточки
function getRandomCard() {
  const rarity = getRandomRarity();

  // Количество карточек каждой редкости
  const totalCards = {
    kal: 8,
    def: 10
  };

  const maxNum = totalCards[rarity] || 1;
  const randomNum = Math.floor(Math.random() * maxNum) + 1;

  // ✅ Используем абсолютный путь к GitHub Pages
  const imagePath = `https://thirteenhh.github.io/WEBAPPTG/img/${rarity}${randomNum}.png`;

  console.log(`🎴 Выпала карта: ${rarity}${randomNum}.png`);
  console.log(`🖼 Путь: ${imagePath}`);

  return { rarity, image: imagePath };
}

// 🧩 Основная логика
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

    display.innerHTML = `
      <img src="${card.image}" 
           alt="${card.rarity}" 
           style="width:200px;height:auto;border-radius:12px;display:block;margin:20px auto;">
      <p style="text-align:center;font-weight:bold;">Выпала: ${card.rarity.toUpperCase()}</p>
    `;
  });

  // 🔘 Меню вкладок
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
