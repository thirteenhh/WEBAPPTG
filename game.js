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
    { type: "kal", chance: 50 },
    { type: "def", chance: 30 },
    { type: "epic", chance: 13 },
    { type: "leg", chance: 7 },
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

    const totalCards = { kal: 8, def: 10, epic: 1, leg: 1 };
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

  // === Работа с локальной "базой" через localStorage ===
  function getUsersDB() {
    return JSON.parse(localStorage.getItem("usersDB") || "{}");
  }

  function saveUsersDB(db) {
    localStorage.setItem("usersDB", JSON.stringify(db));
  }

  function saveCardToUser(card) {
    const userId = tgUser.id;
    const db = getUsersDB();

    if (!db[userId]) {
      db[userId] = {
        id: userId,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        avatar: tgUser.photo_url || "img/avatar.png",
        cards: []
      };
    }

    // Сохраняем уникальные карточки
    if (!db[userId].cards.some(c => c.image === card.image)) {
      db[userId].cards.push(card);
    }

    saveUsersDB(db);
  }

  function getUserCards() {
    const db = getUsersDB();
    return db[tgUser.id]?.cards || [];
  }

  function renderProfile() {
    const db = getUsersDB();
    const user = db[tgUser.id];
    if (!user) return;

    profileAvatar.src = user.avatar;
    profileName.textContent = user.first_name + (user.last_name ? " " + user.last_name : "");

    profileCardsContainer.innerHTML = ""; // очищаем перед рендером
    user.cards.forEach(card => {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.rarity;
      img.classList.add("profileCard");
      profileCardsContainer.appendChild(img);
    });
  }

// === Функция показа карточки с подсветкой и линиями ===
function showCard() {
  const card = getRandomCard();
  const img = new Image();
  img.src = card.image;

  img.onload = () => {
    openBtn.style.display = "none";

    // Цвет свечения
    const glowColor = (() => {
      switch(card.rarity) {
        case "kal": return "rgba(94,0,94,1)";
        case "def": return "rgba(0,255,0,0.5)";
        case "epic": return "rgba(255,0,149,1)";
        case "leg": return "rgba(255,217,0,1)";
        default: return "rgba(128,128,128,0.5)";
      }
    })();

    let cardClass = "cardAnimation"; // стандартная анимация
    if(card.rarity === "epic") cardClass += " epicAnimation";
    if(card.rarity === "leg") cardClass += " legAnimation";

    // Создаем карточку с glow
    const wrapper = document.createElement("div");
    wrapper.className = "cardWrapper";
    wrapper.style.setProperty("--glow-color", glowColor);

    const cardImg = document.createElement("img");
    cardImg.src = card.image;
    cardImg.alt = card.rarity;
    cardImg.className = cardClass;

    wrapper.appendChild(cardImg);
    display.innerHTML = "";
    display.appendChild(wrapper);

    // === Если эпик или легендарка — добавляем линии/серпантин ===
    if(card.rarity === "epic" || card.rarity === "leg") {
      const linesCount = card.rarity === "epic" ? 12 : 20;
      for(let i=0; i<linesCount; i++) {
        const line = document.createElement("div");
        line.className = "sparkLine";
        line.style.backgroundColor = glowColor;
        const angle = Math.random() * 360;
        const distance = card.rarity === "epic" ? 150 : 250;
        line.style.transform = `rotate(${angle}deg) translateY(0px)`;
        line.style.setProperty("--distance", distance + "px");
        wrapper.appendChild(line);

        // анимация вылета
        setTimeout(() => {
          line.style.transform = `rotate(${angle}deg) translateY(-${distance}px)`;
          line.style.opacity = 0;
        }, 50);
      }
    }

    saveCardToUser(card);
    renderProfile();

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
      pages.forEach(p => p.classList.toggle("active", p.id === pageId));

      if (pageId === "pageProfile") {
        renderProfile();
      }
    });
  });

  // === При загрузке сразу рендерим профиль, если открыт ===
  if (document.querySelector(".menuBtn.active")?.dataset.page === "pageProfile") {
    renderProfile();
  }
});
