// Import Firebase modules at the top level
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    let score = 0; // Initial score set to 0
    let timeRemaining = 30; // 30 seconds
    const maxHearts = 15; // Set a maximum number of hearts on screen
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer-display");
    const heartsContainer = document.getElementById("hearts-pippin");
    const gameOverModal = document.getElementById("game-over-modal");
    const finalScoreDisplay = document.getElementById("final-score");
    const playAgainButton = document.getElementById("play-again-button");
    const playButton = document.getElementById("play-button");
    const topScoreDisplay = document.getElementById("top-score-display");
    const playerNameInput = document.getElementById("player-name-input");
    const nameForm = document.getElementById("name-form");

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCxhEA3O8HpaG68EztmC08HLFFCBKYJjsI",
        authDomain: "pippin-119b0.firebaseapp.com",
        projectId: "pippin-119b0",
        storageBucket: "pippin-119b0.firebasestorage.app",
        messagingSenderId: "620099661105",
        appId: "1:620099661105:web:104209d312e973419e5410",
        measurementId: "G-KQMPGENBJP"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // Fetch and display the top score from Firebase
    function fetchTopScore() {
        const topScoreRef = ref(database, 'topScore');
        get(topScoreRef).then((snapshot) => {
            const topScore = snapshot.val() || { username: "", score: 0 };
            topScoreDisplay.innerHTML = `Top Score: <span class="username">${topScore.username} (${topScore.score})</span>`;
        }).catch((error) => {
            console.error("Error fetching top score:", error);
        });
    }

    // Function to save the new top score
    function saveTopScore(username, score) {
        const topScoreRef = ref(database, 'topScore');  // Path to save top score
        set(topScoreRef, { username, score })
            .then(() => {
                topScoreDisplay.innerHTML = `Top Score: <span class="username">${username} (${score})</span>`;
            })
            .catch((error) => {
                console.error("Error saving top score:", error);  // Log any errors
            });
    }

    // Function to update the score
    function updateScore() {
        score++;
        playButton.textContent = `Score: ${score}`;  // Update the play button text
    }

    // Function to pop a heart (when clicked)
    function popHeart(heart) {
        const popSound = new Audio("assets/pop.mp3");
        popSound.currentTime = 0; // Reset sound to the start
        popSound.play();

        heart.style.opacity = 0;

        setTimeout(() => {
            heart.remove();
            regenerateHeart();
        }, 100);
    }

    // Function to regenerate heart
    function regenerateHeart() {
        const currentHearts = heartsContainer.querySelectorAll(".heart").length;

        if (timeRemaining > 0 && currentHearts < maxHearts) {
            const newHeart = document.createElement("div");
            newHeart.classList.add("heart");
            newHeart.style.animationDelay = `${Math.random() * 2}s`;

            newHeart.addEventListener("click", (event) => {
                updateScore();
                popHeart(event.target);
            });

            heartsContainer.appendChild(newHeart);
        }
    }

    // Function to start the countdown timer
    let timerInterval;
    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time: ${timeRemaining}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval); // Stop the timer when it reaches 0
                showGameOver();
            }
        }, 1000); // Update every second
    }

    // Show the game over modal
    function showGameOver() {
        finalScoreDisplay.textContent = `You collected ${score}`;
        gameOverModal.style.display = "flex";

        const topScoreRef = ref(database, 'topScore');
        get(topScoreRef).then((snapshot) => {
            const topScore = snapshot.val() || { username: "", score: 0 };

            if (score > topScore.score) {
                // Show the name input field to allow player to enter their name
                nameForm.style.display = "block"; // Show the name input form

                // When the player submits the name, save the new top score
                nameForm.addEventListener("submit", function(event) {
                    event.preventDefault(); // Prevent form submission
                    const username = playerNameInput.value.trim();
                    if (username) {
                        saveTopScore(username, score);
                        nameForm.style.display = "none"; // Hide name input form after submission
                        finalScoreDisplay.textContent = `New top score: ${score}`;
                    } else {
                        alert("Please enter your name!");
                    }
                });
            }
        });
    }

    // Reset the game function
    function resetGame() {
        score = 0;
        playButton.textContent = `Score: ${score}`;
        timeRemaining = 30;
        timerDisplay.textContent = `Time: ${timeRemaining}`;
        heartsContainer.innerHTML = ''; // Clear remaining hearts

        for (let i = 0; i < maxHearts; i++) {
            regenerateHeart();
        }

        startTimer();
    }

    // Play Again button click listener
    playAgainButton.addEventListener("click", function () {
        gameOverModal.style.display = "none";
        resetGame();
    });

    // Play button click listener
    playButton.addEventListener("click", function () {
        playButton.textContent = `Score: ${score}`;
        timerDisplay.style.display = "block";

        startTimer();

        setInterval(() => {
            regenerateHeart();
        }, 500); // New heart every 0.5 seconds
    });

    // Fetch and display top score on load
    fetchTopScore();
});