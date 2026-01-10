const images = [
  "img1.jpg","img1.jpg",
  "img2.jpg","img2.jpg",
  "img3.jpg","img3.jpg",
  "img4.jpg","img4.jpg",
  "img5.jpg","img5.jpg",
  "img6.jpg","img6.jpg",
  "img7.jpg","img7.jpg",
  "img8.jpg","img8.jpg"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

const board = document.getElementById("board");

images.sort(() => 0.5 - Math.random());

images.forEach(img => {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="front"></div>
    <div class="back" style="background-image:url('${img}')"></div>
  `;

  card.addEventListener("click", () => flipCard(card));
  board.appendChild(card);
});

function flipCard(card) {
  if (lockBoard || card === firstCard) return;

  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  const img1 = firstCard.querySelector(".back").style.backgroundImage;
  const img2 = secondCard.querySelector(".back").style.backgroundImage;

  if (img1 === img2) {
    resetTurn();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
