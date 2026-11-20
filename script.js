
const clickSound = new Audio("accessories/click.wav");
clickSound.volume = 0.5;
clickSound.preload = "auto";
clickSound.playbackRate = 0.7;

document.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();
});


// First music
const music = new Audio("accessories/akatsukii.mp3");
music.volume = 0.3;
music.loop = false;


// Second music
const backgroundMusic = new Audio("accessories/sound.mp3");
backgroundMusic.volume = 0;
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";

const secondMusicStart = 5; // Skip first 5 seconds
const crossfadeDuration = 6; // Crossfade lasts 4 seconds

let crossfadeStarted = false;
let fadeInterval = null;


// Crossfade function
function crossfadeMusic() {
  if (crossfadeStarted) return;
  crossfadeStarted = true;

  // Stop any previous fade
  if (fadeInterval) {
    clearInterval(fadeInterval);
  }

  const fadeDurationMs = crossfadeDuration * 1000;
  const startTime = Date.now();

  // Start the second music
  backgroundMusic.currentTime = secondMusicStart;

  backgroundMusic.play()
    .then(() => console.log("Second music started!"))
    .catch(error => console.log("Second music error:", error));

  const firstVolume = 0.3;
  const secondVolume = 0.3;

  fadeInterval = setInterval(() => {
    const progress = Math.min(
      (Date.now() - startTime) / fadeDurationMs,
      1
    );

    // Fade first song out
    music.volume = firstVolume * (1 - progress);

    // Fade second song in
    backgroundMusic.volume = secondVolume * progress;

    // Finish crossfade
    if (progress >= 1) {
      clearInterval(fadeInterval);
      fadeInterval = null;

      music.pause();
      music.volume = firstVolume;

      backgroundMusic.volume = secondVolume;

      console.log("Crossfade complete!");
    }
  }, 50);
}


// Detect when the first song is almost finished
music.addEventListener("timeupdate", () => {
  if (!crossfadeStarted && music.duration) {
    if (music.currentTime >= music.duration - crossfadeDuration) {
      crossfadeMusic();
    }
  }
});


const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const startBtn = document.getElementById("start-btn");

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");

let currentQuestionIndex = 0;
let answering = false;


// Start quiz
startBtn.addEventListener("click", function () {

  // Stop both sounds if quiz is restarted
  music.pause();
  backgroundMusic.pause();

  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  // Reset music
  music.currentTime = 0;
  backgroundMusic.currentTime = secondMusicStart;

  music.volume = 0.3;
  backgroundMusic.volume = 0;

  crossfadeStarted = false;

  // Play first music
  music
    .play()
    .then(() => console.log("First music started!"))
    .catch((error) => console.log("Music error:", error));

  intro.hidden = true;
  quiz.hidden = false;

  currentQuestionIndex = 0;
  answering = false;

  // Reset scores
  scores.vampire = 0;
  scores.werewolf = 0;
  scores.witch = 0;
  scores.siren = 0;

  // Hide Next Question button
  nextBtn.hidden = true;

  showQuestion();
});


// Display question
function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  questionText.textContent = currentQuestion.question;

  answerOptions.innerHTML = "";
  answerOptions.classList.toggle(
    "image-options",
    currentQuestion.options.some((option) => option.image),
  );

  answering = false;

  // Update progress bar
  progress.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  // Display answer options
  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("answer-option");

    // Display image if available
    if (option.image) {
      const image = document.createElement("img");

      image.src = option.image;
      image.alt = option.text;
      image.classList.add("answer-image");

      button.appendChild(image);
    }

    const text = document.createElement("span");
    text.textContent = option.text;

    button.appendChild(text);

    // Automatically move to next question
    button.addEventListener("click", function () {
      if (answering) return;

      answering = true;

      // Highlight selected answer
      button.classList.add("selected");

      // Prevent multiple selections
      document.querySelectorAll(".answer-option").forEach((btn) => {
        btn.disabled = true;
      });

      // Calculate score
      calculateScore(option);

      // Wait briefly before moving forward
      setTimeout(function () {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
          showQuestion();
        } else {
          showResult();
        }
      }, 350);
    });

    answerOptions.appendChild(button);
  });
}


// Display final result
function showResult() {
  questionNumber.textContent = "YOUR DARK SIDE REVEALED";

  questionText.textContent = "Your Monster Personality Is...";

  answerOptions.innerHTML = "";

  progress.style.width = "100%";

  nextBtn.hidden = true;

  const winners = getResult();

  const resultNames = {
    vampire: "Vampire 🧛🏼‍♀️",
    werewolf: "Werewolf 🐺",
    witch: "Witch 🧙🏼‍♀️",
    siren: "Siren 🧜🏾‍♀️",
  };

  const result = document.createElement("h2");

  result.textContent = winners
    .map((monster) => resultNames[monster])
    .join(" & ");

  answerOptions.appendChild(result);
}
