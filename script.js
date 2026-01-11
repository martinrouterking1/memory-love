// 🔴 INCOLLA QUI IL TUO URL RENDER
const socket = new WebSocket("wss://TUO-SERVER.onrender.com");

let playerId = null;
let myTurn = false;

const images = [
  "images/img1.jpg","images/img1.jpg",
  "images/img2.jpg","images/img2.jpg",
  "images/img3.jpg","images/img3.jpg",
  "images/img4.jpg","images/img4.jpg",
  "images/img5.jpg","images/img5.jpg",
  "images/img6.jpg","images/img6.jpg",
  "images/img7.jpg","images/img7.jpg",
  "images/img8.jpg","images/img8.jpg"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

const board = document.getElementById("board");
const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const status = document.getElementById("status");
const turnText = document.getElementById("turn");
const scoreText = document.getElementById("score");

// mescola carte
images.sort(() => 0.5 - Math.random());

// crea carte
images.forEach(img => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.img = img;

  card.innerHTML = `
    <div class="front"></div>
    <div class="back" style="background-image:url('${img}')"></div>
  `;

  card.addEventListener("click", () => {
    if (!myTurn || lockBoard || card.classList.contains("flip")) return;
    flipCard(card);
  });

  board.appendChild(card);
});

// websocket
socket.onmessage = e => {
  const data = JSON.parse(e.data);

  if (data.type === "init") {
    playerId = data.playerId;
    status.textContent = "Giocatore collegato ✔️";
  }

  if (data.type === "update") {
    // quando arriva il primo update → il gioco parte
    lobby.classList.add("hidden");
    game.classList.remove("hidden");

    myTurn = data.gameState.turn === playerId;
    turnText.textContent = myTurn ? "Il tuo turno ❤️" : "Turno avversario…";
    scoreText.textContent = `${data.gameState.scores[0]} - ${data.gameState.scores[1]}`;
  }

  if (data.type === "full") {
    alert("Partita già in corso");
  }
};


function flipCard(card) {
  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  lockBoard = true;

  if (firstCard.dataset.img === secondCard.dataset.img) {
    socket.send(JSON.stringify({ type: "match" }));
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      socket.send(JSON.stringify({ type: "turn" }));
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

