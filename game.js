// === Инициализация Telegram WebApp ===
const tg = window.Telegram?.WebApp;
tg?.ready();
const tgUser = tg?.initDataUnsafe?.user || {};

// === Подставляем мини-профиль на главной странице ===
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

  function getRandomRarity() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const r of rarities) {
      sum += r.chance;
      if (rand <= sum) return r.type;
    }
    return rarities[0].type;
  }

  function getRandomCard() {
    const rarity = getRandomRarity();
    const totalCards = { kal: 8, def: 10 };
    const randomNum = Math.floor(Math.random() * totalCards[rarity]) + 1;
    return { rarity, image: `img/${rarity}${randomNum}.png` };
  }

  // === Элементы DOM ===
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const menuButtons = document.querySelectorAll(".menuBtn");
  const pages = document.querySelectorAll(".page");

  // Профиль
  const profileAvatar = document.getElementById("profileAvatar");
  const profileName = document.getElementById("profileName");
  const profileCardsContainer = document.getElementById("profileCards");

  // === Локальная база пользователей (имитация users.json) ===
  const usersDB = {}; // структура: usersDB[userId] = {cards: [...]}

  function saveCardToUser(card) {
    const userId = tgUser.id;
    if (!usersDB[userId]) {
      usersDB[userId] = { 
        id: userId,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        avatar: tgUser.photo_url || "img/avatar.png",
        cards: []
      };
    }

    const alreadyHave = usersDB[userId].cards.some(c => c.image === card.image);
    if (!alreadyHave) {
      usersDB[userId].cards.push(card);
    }
  }

  function renderProfile() {
    const userId = tgUser.id;
    const user = usersDB[userId];
    if (!user) return;

    profileAvatar.src = user.avatar;
    profileName.textContent = user.first_name + (user.last_name ? " " + user.last_name : "");

    profileCardsContainer.innerHTML = ""; // очищаем старое
    user.cards.forEach(card => {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.rarity;
      img.classList.add("profileCard");
      profileCardsContainer.appendChild(img);
    });
  }

  // === Функция показа карточки с подсветкой ===
  function showCard() {
    const card = getRandomCard();
    const img = new Image();
    img.src = card.image;

    img.onload = () => {
      openBtn.style.display = "none";

      // Цвет свечения
      const glowColor = card.rarity === "kal"
        ? "rgba(128,0,128,0.5)"
        : "rgba(0,255,0,0.5)";

      display.innerHTML = `
        <div class="cardWrapper" style="--glow-color: ${glowColor};">
          <img src="${card.image}" alt="${card.rarity}" class="cardAnimation">
        </div>
      `;

      saveCardToUser(card); // сохраняем в "базу"
      renderProfile();      // обновляем профиль

      // Кнопка "Открыть ещё"
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

  // === Переключение вкладок ===
  menuButtons.forEach(button => {
    button.addEventListener("click", () => {
      menuButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const pageId = button.dataset.page;
      pages.forEach(p => {
        p.classList.toggle("active", p.id === pageId);
      });
    });
  });
});
