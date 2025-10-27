// === Telegram User ===
const tg = window.Telegram?.WebApp;
tg?.ready();
const tgUser = tg?.initDataUnsafe?.user || {};

// Подставляем мини-профиль на главной странице
document.addEventListener("DOMContentLoaded", () => {
  const avatarImg = document.getElementById("userAvatar");
  const nameSpan = document.getElementById("userName");

  avatarImg.src = tgUser.photo_url || "img/avatar.png";
  nameSpan.textContent = tgUser.first_name 
    ? tgUser.first_name + (tgUser.last_name ? " " + tgUser.last_name : "") 
    : "Имя пользователя";

  // === Настройка редкостей карточек ===
  const rarities = [
    { type: "kal", chance: 70 },
    { type: "def", chance: 30 }
  ];

  // Случайная редкость
  function getRandomRarity() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const r of rarities) {
      sum += r.chance;
      if (rand <= sum) return r.type;
    }
    return rarities[0].type;
  }

  // Случайная карточка
  function getRandomCard() {
    const rarity = getRandomRarity();
    const totalCards = { kal: 8, def: 10 };
    const randomNum = Math.floor(Math.random() * totalCards[rarity]) + 1;
    return { rarity, image: `img/${rarity}${randomNum}.png` };
  }

  // === Основная логика ===
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const menuButtons = document.querySelectorAll(".menuBtn");
  const pages = document.querySelectorAll(".page");

  // Открытие карточки
  function showCard() {
    const card = getRandomCard();
    const img = new Image();
    img.src = card.image;
    img.onload = () => {
      openBtn.style.display = "none";
      display.innerHTML = `<img src="${card.image}" alt="${card.rarity}" class="cardAnimation">`;

      setTimeout(() => {
        const newBtn = document.createElement("button");
        newBtn.textContent = "Открыть ещё";
        newBtn.id = "openAgain";
        newBtn.classList.add("fadeIn");
        display.appendChild(newBtn);

        newBtn.addEventListener("click", () => {
          newBtn.remove();
          showCard();
        });
      }, 1000);
    };
  }

  openBtn.addEventListener("click", showCard);

  // Переключение вкладок
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      menuButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const pageId = button.dataset.page;
      pages.forEach(p => {
        if (p.id === pageId) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });
    });
  });
});
