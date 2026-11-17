const clickSound = new Audio("accessories/click.wav");
clickSound.volume = 0.5;
clickSound.preload = "auto";
clickSound.playbackRate=0.7;
document.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();
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

    questionNumber.textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    questionText.textContent = currentQuestion.question;

    answerOptions.innerHTML = "";
    answerOptions.classList.toggle(
  "image-options",
  currentQuestion.options.some(option => option.image)
);


    answering = false;

    // Update progress bar
    progress.style.width =
        `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

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
            document.querySelectorAll(".answer-option").forEach(btn => {
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
        siren: "Siren 🧜🏾‍♀️"
    };

    const result = document.createElement("h2");

    result.textContent = winners
        .map(monster => resultNames[monster])
        .join(" & ");

    answerOptions.appendChild(result);
}

