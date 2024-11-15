document.addEventListener("DOMContentLoaded", function () {
    let score = 0; // Initial score set to 0
    let timeRemaining = 30; // 30 seconds
    const maxHearts = 10; // Set a maximum number of hearts on screen
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer-display");
    const heartsContainer = document.getElementById("hearts-pippin");
    const gameOverModal = document.getElementById("game-over-modal");
    const finalScoreDisplay = document.getElementById("final-score");
    const playAgainButton = document.getElementById("play-again-button");
    const playButton = document.getElementById("play-button");

    // Display the initial score and timer
    timerDisplay.textContent = `Time: ${timeRemaining}`;

    // Load the pop sound
    const popSound = new Audio("assets/pop.mp3");

    // Function to update the score
    function updateScore() {
        score++;
        playButton.textContent = `Score: ${score}`;  // Update the play button text
    }

    // Function to pop a heart (when clicked)
    function popHeart(heart) {
        // Play the pop sound
        popSound.currentTime = 0; // Reset sound to the start
        popSound.play();

        // Immediately remove the heart when clicked
        heart.style.opacity = 0;

        // Remove the heart after it disappears
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

            // Set random position for the new heart if needed
            newHeart.style.animationDelay = `${Math.random() * 2}s`; // Faster regeneration

            // Add click event listener to the new heart
            newHeart.addEventListener("click", (event) => {
                updateScore();
                popHeart(event.target);
            });

            // Append the new heart to the container
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
        finalScoreDisplay.textContent = `you collected ${score}`;
        gameOverModal.style.display = "flex"; // Show modal
    }

    // Reset the game function
    function resetGame() {
        score = 0;
        playButton.textContent = `Score: ${score}`;  // Reset the play button text

        timeRemaining = 30;
        timerDisplay.textContent = `Time: ${timeRemaining}`;

        heartsContainer.innerHTML = ''; // Clear remaining hearts
        for (let i = 0; i < maxHearts; i++) { // Add initial hearts again
            regenerateHeart();
        }

        startTimer();
    }

    // Play Again button click listener
    playAgainButton.addEventListener("click", function () {
        gameOverModal.style.display = "none"; // Hide the modal
        resetGame(); // Reset the game
    });

    // Play button click listener
    playButton.addEventListener("click", function () {
        // Update play button with the score on game start
        playButton.textContent = `Score: ${score}`; // Set initial score in play button text

        // Hide the play button title after starting the game
        playButton.style.display = "inline-block"; // Ensure it's still visible if needed

        // Show the score and timer
        timerDisplay.style.display = "block"; // Show timer

        // Start the game logic
        startTimer();

        // Start regenerating hearts at a regular interval
        heartRegenerationInterval = setInterval(() => {
            regenerateHeart();
        }, 500); // New heart every 0.5 seconds
    });
});
