const grid = document.getElementById('grid');
const flipCounter = document.getElementById('flipCounter');
const matchCounter = document.getElementById('matchCounter');
const leastFlipsDisplay = document.getElementById('leastFlips');
const winMessage = document.getElementById('winMessage');
const topicSelector = document.getElementById('topicSelector');
const startButton = document.getElementById('startButton');

let totalFlips = 0;
let totalMatches = 0;
let leastFlips = null;
let firstCard, secondCard, lockBoard = false;

const topics = {
    animals: Array.from({ length: 22 }, (_, i) => `animal${i + 1}.jpg`),
    birds: Array.from({ length: 22 }, (_, i) => `bird${i + 1}.jpg`),
    dragons: Array.from({ length: 22 }, (_, i) => `dragon${i + 1}.jpg`),
    fruits: Array.from({ length: 22 }, (_, i) => `fruit${i + 1}.jpg`),
    flowers: Array.from({ length: 22 }, (_, i) => `flower${i + 1}.jpg`),
    aquatic: Array.from({ length: 22 }, (_, i) => `aquatic${i + 1}.jpg`)
};

// Load least flips from local storage when the page loads
window.onload = () => {
    const storedLeastFlips = localStorage.getItem('leastFlips');
    if (storedLeastFlips !== null) {
        leastFlips = parseInt(storedLeastFlips, 10);
        leastFlipsDisplay.textContent = leastFlips;
    }
};

function startGame() {
    totalFlips = 0;
    totalMatches = 0;
    flipCounter.textContent = totalFlips;
    matchCounter.textContent = totalMatches;
    winMessage.textContent = ''; // Clear win message
    grid.innerHTML = ''; // Clear grid

    const selectedTopic = topicSelector.value;
    let images = [];

    if (selectedTopic === 'random') {
        const randomTopicKey = Object.keys(topics)[Math.floor(Math.random() * Object.keys(topics).length)];
        images = topics[randomTopicKey].map(image => `${randomTopicKey}/${image}`);
    } else {
        images = topics[selectedTopic].map(image => `${selectedTopic}/${image}`);
    }

    const shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
    shuffledImages.forEach(image => createCard(image));
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${image}')`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', flipCard);
    card.dataset.image = image;
    grid.appendChild(card);
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    totalFlips++;
    flipCounter.textContent = totalFlips;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        totalMatches++;
        matchCounter.textContent = totalMatches;

        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        firstCard = null;
        secondCard = null;

        if (totalMatches === 22) {
            checkWin();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000);
    }
}

function checkWin() {
    if (leastFlips === null || totalFlips < leastFlips) {
        leastFlips = totalFlips;
        leastFlipsDisplay.textContent = leastFlips;
        localStorage.setItem('leastFlips', leastFlips); // Save to local storage
    }
    winMessage.textContent = 'Congratulations! You found all matches!';
}

startButton.addEventListener('click', startGame);
