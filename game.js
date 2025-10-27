// 🎴 Настройка редкостей карточек
const rarities = [
  { type: "kal", chance: 70 }, // говно
  { type: "def", chance: 30 }  // обычная
];

// 🎲 Случайная редкость
function getRandomRarity() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (const r of rarities) {
    sum += r.chance;
    if (rand <= sum) return r.type;
  }
  return rarities[0].type; // fallback
}

// 🃏 Случайная карточка
function getRandomCard() {
  const rarity = getRandomRarity();
  const totalCards = { kal: 8, def: 10 };
  const maxNum = totalCards[rarity];
  const randomNum = Math.floor(Math.random() * maxNum) + 1;
  return { rarity, image: `img/${rarity}${randomNum}.png` };
}

// === ОСНОВНАЯ ЛОГИКА ===
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");

  // === Функция открытия карточки ===
  function showCard() {
    const card = getRandomCard();

    // Предзагрузка картинки, чтобы не грузилась частями
    const img = new Image();
    img.src = card.image;
    img.onload = () => {
      // Скрываем кнопку "Открыть"
      openBtn.style.display = "none";

      // Показываем карточку с анимацией
      display.innerHTML = `<img src="${card.image}" alt="${card.rarity}" class="cardAnimation">`;

      // Через 1 секунду появляется кнопка "Открыть ещё"
      setTimeout(() => {
        const newBtn = document.createElement("button");
        newBtn.textContent = "Открыть ещё";
        newBtn.id = "openAgain";
        newBtn.classList.add("fadeIn");
        display.appendChild(newBtn);

        newBtn.addEventListener("click", () => {
          newBtn.remove();
          showCard(); // повторное открытие
        });
      }, 1000);
    };
  }

  openBtn.addEventListener("click", showCard);

  // === Переключение вкладок (страниц) ===
  const menuButtons = document.querySelectorAll(".menuBtn");
  const pages = document.querySelectorAll(".page");

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Активная кнопка
      menuButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Показать соответствующую страницу
      const pageId = button.dataset.page;
      pages.forEach((p) => p.classList.remove("active"));
      const page = document.getElementById(pageId);
      if (page) page.classList.add("active");
    });
  });
});
