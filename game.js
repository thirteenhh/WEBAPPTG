const cards = [
  {name: "Обычная", rarity: 70},
  {name: "Редкая", rarity: 25},
  {name: "Эпическая", rarity: 4},
  {name: "Легендарная", rarity: 1}
];

function getRandomCard() {
  const rand = Math.random() * 100;
  let sum = 0;
  for (const card of cards) {
    sum += card.rarity;
    if (rand <= sum) return card;
  }
}
const tg = window.Telegram.WebApp;
tg.ready();  // говорит Telegram, что игра загрузилась
console.log(tg.initDataUnsafe.user); // инфо о пользователе

if (window.innerHeight < window.innerWidth) {
  alert("Пожалуйста, переверните устройство в портретный режим");
}
