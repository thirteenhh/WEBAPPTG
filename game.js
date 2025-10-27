const rarities = [
  { type: "kal", chance: 70 }, // говно
  { type: "def", chance: 30 }  // обычная
];

function getRandomRarity() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (const r of rarities) {
    sum += r.chance;
    if (rand <= sum) return r.type;
  }
}

function getRandomCard() {
  const rarity = getRandomRarity();
  const totalCards = {
    kal: 8,
    def: 10
  };
  const maxNum = totalCards[rarity];
  const randomNum = Math.floor(Math.random() * maxNum) + 1;
  return {
    rarity,
    image: `img/${rarity}${randomNum}.png`
  };
}

// === ОСНОВНАЯ ЛОГИКА ===
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("cardDisplay");
  const openBtn = document.getElementById("openCase");
  const bottomMenu = document.getElementById("bottomMenu");

  function showCard() {
    const card = getRandomCard();

    // мгновенная подгрузка (чтобы не было "по частям")
    const img = new Image();
    img.src = card.image;
    img.onload = () => {
      // скрываем кнопку
      openBtn.style.display = "none";

      // показываем карточку с анимацией
      display.innerHTML = `<img src="${card.image}" alt="${card.rarity}" class="cardAnimation">`;

      // через 1 секунду после появления карточки
      setTimeout(() => {
        const newBtn = document.createElement("button");
        newBtn.textContent = "Открыть ещё";
        newBtn.id = "openAgain";
        newBtn.classList.add("fadeIn");
        display.appendChild(newBtn);

        newBtn.onclick = () => {
          newBtn.remove();
          showCard(); // повторно открыть
        };
      }, 1000);
    };
  }

  openBtn.addEventListener("click", showCard);

  // нижнее меню
  const menuButtons = document.querySelectorAll('.menuBtn');
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
