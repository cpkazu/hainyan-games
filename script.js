document.addEventListener('DOMContentLoaded', () => {
    const cardImages = [
        // トランプの画像リスト
        'spade_a.png', 'spade_k.png', 'spade_q.png', 'spade_j.png', 'spade_02.png', 'spade_03.png', 'spade_04.png', 'spade_05.png', 'spade_06.png', 'spade_07.png', 'spade_08.png', 'spade_09.png', 'spade_10.png', 
        'heart_a.png', 'heart_k.png', 'heart_q.png', 'heart_j.png', 'heart_02.png', 'heart_03.png', 'heart_04.png', 'heart_05.png', 'heart_06.png', 'heart_07.png', 'heart_08.png', 'heart_09.png', 'heart_10.png', 
        'diamond_a.png', 'diamond_k.png', 'diamond_q.png', 'diamond_j.png', 'diamond_02.png', 'diamond_03.png', 'diamond_04.png', 'diamond_05.png', 'diamond_06.png', 'diamond_07.png', 'diamond_08.png', 'diamond_09.png', 'diamond_10.png', 
        'club_a.png', 'club_k.png', 'club_q.png', 'club_j.png', 'club_02.png', 'club_03.png', 'club_04.png', 'club_05.png', 'club_06.png', 'club_07.png', 'club_08.png', 'club_09.png', 'club_10.png', 
        'joker_01.png', 'joker_02.png'
    ];

    // 難易度設定
    const difficultySettings = {
        easy: { pairs: 8, message: '16枚で行います。めくったカードの絵柄が合っていればペア判定です。' },  // 8ペア (16枚)
        medium: { pairs: 13, message: '26枚で行います。めくったカードのキャストが同じ場合はペア判定です。' }, // 13ペア (26枚)
        hard: { pairs: 18, message: '36枚で行います。めくったカードのキャストが同じ場合はペア判定です。' }   // 18ペア (36枚)
    };

    // HTML要素の取得
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-game');
    const difficultySelect = document.getElementById('difficulty');
    const messageDiv = document.getElementById('message');

    // ゲームの状態を保持する変数
    let flippedCards = [];
    let matchedPairs = 0;
    let currentPlayer = 'player'; // 'player' or 'cpu'
    let playerScore = 0;
    let cpuScore = 0;

    // ゲーム開始ボタンのクリックイベント
    startButton.addEventListener('click', startGame);

    function startGame() {
        // 選択された難易度の取得
        const difficulty = difficultySelect.value;
        const { pairs, message } = difficultySettings[difficulty];
        alert(message); // 難易度選択時のメッセージ表示
        const selectedCards = selectUniqueCards(pairs, difficulty);
        const shuffledCards = shuffle([...selectedCards, ...selectedCards]);
        gameBoard.innerHTML = '';
        gameBoard.className = ''; // 既存のクラスをクリア
        gameBoard.classList.add(difficulty); // 難易度に応じたクラスを追加
        messageDiv.textContent = '';
        flippedCards = [];
        matchedPairs = 0;
        playerScore = 0;
        cpuScore = 0;
        currentPlayer = 'player';

        // シャッフルされたカードをゲームボードに追加
        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.classList.add(difficulty); // 難易度に応じたクラスを追加
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

    // カードをめくる処理
    function flipCard(card) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    // 2枚のカードが一致するかどうかをチェック
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const difficulty = difficultySelect.value;

        let isMatch;
        if (difficulty === 'easy') {
            isMatch = card1.dataset.image === card2.dataset.image;
        } else {
            isMatch = getCardNumber(card1.dataset.image) === getCardNumber(card2.dataset.image);
        }

        if (isMatch) {
            matchedPairs++;
            card1.classList.add('match');
            card2.classList.add('match');
            flippedCards = [];
            if (currentPlayer === 'player') {
                playerScore++;
            } else {
                cpuScore++;
            }
            updateScore();
            setTimeout(() => {
                card1.classList.remove('match');
                card2.classList.remove('match');
                if (matchedPairs === difficultySettings[difficulty].pairs) {
                    displayEndMessage();
                } else {
                    nextTurn();
                }
            }, 1000); // エフェクトの後に次のターンに移る
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                nextTurn();
            }, 2000); // 待機2秒
        }
    }

    // 次のプレイヤーにターンを渡す
    function nextTurn() {
        currentPlayer = currentPlayer === 'player' ? 'cpu' : 'player';
        if (currentPlayer === 'cpu') {
            setTimeout(cpuTurn, 1000);
        }
    }

    // CPUのターンの処理
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

    // スコアを更新
    function updateScore() {
        messageDiv.textContent = `プレイヤー: ${playerScore} - CPU: ${cpuScore}`;
    }

    // 配列をシャッフル
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 難易度に応じてユニークなカードを選択
    function selectUniqueCards(numPairs, difficulty) {
        const uniqueCards = [];
        const cardNumbers = Array.from({ length: 10 }, (_, i) => (i + 2).toString().padStart(2, '0')).concat(['a', 'k', 'q', 'j']);
        shuffle(cardNumbers);
        let selectedCards = [];
        for (let i = 0; i < numPairs; i++) {
            const cardNumber = cardNumbers[i];
            selectedCards.push(`spade_${cardNumber}.png`);
            selectedCards.push(`heart_${cardNumber}.png`);
            selectedCards.push(`diamond_${cardNumber}.png`);
            selectedCards.push(`club_${cardNumber}.png`);
        }
        if (difficulty !== 'easy') {
            uniqueCards.push(...selectedCards.slice(0, numPairs));
        }
        return uniqueCards.length > 0 ? uniqueCards : shuffle(selectedCards).slice(0, numPairs);
    }

    // カードの番号を取得
    function getCardNumber(card) {
        const parts = card.split('_');
        return parts[1].split('.')[0];
    }

    // ゲーム終了時にメッセージを表示
    function displayEndMessage() {
        let message = '';
        if (playerScore > cpuScore) {
            message = 'おめでとうございます！ あなたの勝ちです！';
            displayCelebration();
        } else if (playerScore < cpuScore) {
            message = '残念！ CPUの勝ちです。';
        } else {
            message = '引き分けです。';
        }
        setTimeout(() => alert(message), 100);
    }

    // 勝利時のお祝いアニメーションを表示
    function displayCelebration() {
        const confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confettiContainer.appendChild(confetti);
        }
        document.body.appendChild(confettiContainer);

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000); // 5秒後に消える
    }
});
