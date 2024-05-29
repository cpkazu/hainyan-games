document.addEventListener('DOMContentLoaded', () => {
    const cardImages = [
        'spade_a.jpg', 'spade_k.jpg', 'spade_q.jpg', 'spade_j.jpg', 'spade_01.jpg', 'spade_02.jpg', 'spade_03.jpg', 'spade_04,jpg', 'spade_05,jpg', 'spade_06,jpg', 'spade_07,jpg', 'spade_08,jpg', 'spade_09,jpg', 'spade_10,jpg', 
        'heart_a.jpg', 'heart_k.jpg', 'heart_q.jpg', 'heart_j.jpg', 'heart_01.jpg', 'heart_02.jpg', 'heart_03.jpg', 'heart_04.jpg', 'heart_05.jpg', 'heart_06.jpg', 'heart_07.jpg', 'heart_08.jpg', 'heart_09.jpg', 'heart_10.jpg', 
        'diamond_a.jpg', 'diamond_k.jpg', 'diamond_q.jpg', 'diamond_j.jpg', 'diamond_01.jpg', 'diamond_02.jpg', 'diamond_03.jpg', 'diamond_04.jpg', 'diamond_05.jpg', 'diamond_06.jpg', 'diamond_07.jpg', 'diamond_08.jpg', 'diamond_09.jpg', 'diamond_10.jpg', 
        'club_a.jpg', 'club_k.jpg', 'club_q.jpg', 'club_j.jpg', 'club_01.jpg', 'club_02.jpg', 'club_03.jpg', 'club_04.jpg', 'club_05.jpg', 'club_06.jpg', 'club_07.jpg', 'club_08.jpg', 'club_09.jpg', 'club_10.jpg'
    ];

    const difficultySettings = {
        easy: 10,  // 10ペア (20枚)
        medium: 17, // 17ペア (34枚)
        hard: 26   // 26ペア (52枚)
    };

    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-game');
    const difficultySelect = document.getElementById('difficulty');
    const messageDiv = document.getElementById('message');

    let flippedCards = [];
    let matchedPairs = 0;
    let currentPlayer = 'player'; // 'player' or 'cpu'
    let playerScore = 0;
    let cpuScore = 0;

    startButton.addEventListener('click', startGame);

    function startGame() {
        const difficulty = difficultySelect.value;
        const numPairs = difficultySettings[difficulty];
        const selectedCards = shuffle(cardImages).slice(0, numPairs);
        const shuffledCards = shuffle([...selectedCards, ...selectedCards]);
        gameBoard.innerHTML = '';
        messageDiv.textContent = '';
        flippedCards = [];
        matchedPairs = 0;
        playerScore = 0;
        cpuScore = 0;
        currentPlayer = 'player';

        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            const cardImage = document.createElement('img');
            cardImage.src = `images/${image}`;
            card.appendChild(cardImage);

            card.addEventListener('click', () => {
                if (currentPlayer === 'player' && flippedCards.length < 2 && !card.classList.contains('flipped')) {
                    flipCard(card);
                }
            });

            gameBoard.appendChild(card);
        });

        if (currentPlayer === 'cpu') {
            cpuTurn();
        }
    }

    function flipCard(card) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.image === card2.dataset.image) {
            matchedPairs++;
            flippedCards = [];
            if (currentPlayer === 'player') {
                playerScore++;
            } else {
                cpuScore++;
            }
            updateScore();
            if (matchedPairs === cardImages.length / 2) {
                setTimeout(() => alert(`ゲーム終了！ プレイヤー: ${playerScore} - CPU: ${cpuScore}`), 100);
            } else {
                nextTurn();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                nextTurn();
            }, 1000);
        }
    }

    function nextTurn() {
        currentPlayer = currentPlayer === 'player' ? 'cpu' : 'player';
        if (currentPlayer === 'cpu') {
            setTimeout(cpuTurn, 1000);
        }
    }

    function cpuTurn() {
        const unflippedCards = Array.from(document.querySelectorAll('.card:not(.flipped)'));
        const randomIndex1 = Math.floor(Math.random() * unflippedCards.length);
        const card1 = unflippedCards[randomIndex1];
        flipCard(card1);

        setTimeout(() => {
            const unflippedCardsAfterFirstFlip = Array.from(document.querySelectorAll('.card:not(.flipped)'));
            const randomIndex2 = Math.floor(Math.random() * unflippedCardsAfterFirstFlip.length);
            const card2 = unflippedCardsAfterFirstFlip[randomIndex2];
            flipCard(card2);
        }, 500);
    }

    function updateScore() {
        messageDiv.textContent = `プレイヤー: ${playerScore} - CPU: ${cpuScore}`;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
