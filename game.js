const questions = [
    {
        question: "Which of the following is a primary objective of software testing?",
        answers: [
            "To prove that the software has no defects",
            "To find defects and reduce the risk of software failure",
            "To ensure developers do not make mistakes",
            "To eliminate the need for debugging"
        ],
        correct: 1
    },
    {
        question: "Which testing principle states that testing everything is not feasible?",
        answers: [
            "Defect clustering",
            "Testing shows the presence of defects",
            "Exhaustive testing is impossible",
            "Absence-of-errors fallacy"
        ],
        correct: 2
    },
    {
        question: "What is regression testing primarily used for?",
        answers: [
            "Testing only newly developed functionality",
            "Checking that changes have not adversely affected existing functionality",
            "Testing the performance of the system",
            "Testing without predefined test cases"
        ],
        correct: 1
    },
    {
        question: "Which of the following is a black-box test technique?",
        answers: [
            "Statement testing",
            "Branch testing",
            "Equivalence partitioning",
            "Code coverage"
        ],
        correct: 2
    },
    {
        question: "What is the main purpose of a test case?",
        answers: [
            "To describe developer activities",
            "To document inputs, actions and expected results for a test objective",
            "To replace the test plan",
            "To record only software defects"
        ],
        correct: 1
    }
];

let playerName = "";
let currentQuestion = 0;
let correctCount = 0;
let answeredCount = 0;
let selectedAnswer = null;
let rating = 0;

let timeRemaining = 180;
let timerInterval = null;

const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    document
        .getElementById(screenId)
        .classList.add("active");
}

document
    .getElementById("startButton")
    .addEventListener("click", startGame);

function startGame() {

    const nameInput =
        document.getElementById("playerName");

    playerName = nameInput.value.trim();

    if (!playerName) {
        document.getElementById("nameError").textContent =
            "Please enter your name.";
        return;
    }

    document.getElementById("nameError").textContent = "";

    currentQuestion = 0;
    correctCount = 0;
    answeredCount = 0;
    timeRemaining = 180;

    showScreen("quizScreen");

    loadQuestion();
    startTimer();
}

function startTimer() {

    document.getElementById("timer").textContent =
        timeRemaining;

    timerInterval = setInterval(() => {

        timeRemaining--;

        document.getElementById("timer").textContent =
            timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            finishGame();
        }

    }, 1000);
}

function loadQuestion() {

    selectedAnswer = null;

    const question = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("questionText").textContent =
        question.question;

    document.getElementById("progressBar").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    document.getElementById("answerError").textContent = "";

    const container =
        document.getElementById("answerContainer");

    container.innerHTML = "";

    question.answers.forEach((answer, index) => {

        const label = document.createElement("label");

        label.className = "answer-option";

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "answer";
        radio.value = index;

        radio.addEventListener("change", () => {

            selectedAnswer = index;

            document
                .querySelectorAll(".answer-option")
                .forEach(option =>
                    option.classList.remove("selected")
                );

            label.classList.add("selected");
        });

        label.appendChild(radio);

        label.appendChild(
            document.createTextNode(answer)
        );

        container.appendChild(label);
    });

    document.getElementById("nextButton").textContent =
        currentQuestion === questions.length - 1
            ? "Finish Quest"
            : "Next Question";
}

document
    .getElementById("nextButton")
    .addEventListener("click", nextQuestion);

function nextQuestion() {

    if (selectedAnswer === null) {

        document.getElementById("answerError").textContent =
            "Please select an answer.";

        return;
    }

    answeredCount++;

    if (
        selectedAnswer ===
        questions[currentQuestion].correct
    ) {
        correctCount++;
    }

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        finishGame();
    } else {
        loadQuestion();
    }
}

document
    .getElementById("stopButton")
    .addEventListener("click", () => {

        const confirmStop =
            confirm(
                "Do you want to stop the quest and continue to your score?"
            );

        if (confirmStop) {
            finishGame();
        }
    });

function finishGame() {

    clearInterval(timerInterval);

    const score = correctCount * 20;

    document.getElementById("resultName").textContent =
        playerName;

    document.getElementById("finalScore").textContent =
        score;

    document.getElementById("correctAnswers").textContent =
        correctCount;

    document.getElementById("wrongAnswers").textContent =
        answeredCount - correctCount;

    document.getElementById("answeredQuestions").textContent =
        `${answeredCount}/${questions.length}`;

    let message;

    if (score === 100) {
        message = "Outstanding! ISTQB Champion! 🌟";
    } else if (score >= 80) {
        message = "Excellent performance! 🎉";
    } else if (score >= 60) {
        message = "Good job! 👍";
    } else if (score >= 40) {
        message = "Good attempt. Keep learning! 📚";
    } else {
        message = "Keep practicing and try again! 💪";
    }

    document.getElementById("performanceMessage").textContent =
        message;

    showScreen("scoreScreen");
}

document
    .getElementById("feedbackButton")
    .addEventListener("click", () => {

        const score = correctCount * 20;

        document.getElementById("feedbackName").value =
            playerName;

        document.getElementById("feedbackScore").value =
            `${score}/100`;

        showScreen("feedbackScreen");
    });

const starButtons =
    document.querySelectorAll("#starRating button");

starButtons.forEach(button => {

    button.addEventListener("click", () => {

        rating = Number(button.dataset.rating);

        starButtons.forEach(star => {

            const starValue =
                Number(star.dataset.rating);

            star.classList.toggle(
                "active",
                starValue <= rating
            );
        });

        document.getElementById("ratingText").textContent =
            `${rating} out of 5 stars`;
    });
});

document
    .getElementById("submitFeedback")
    .addEventListener("click", submitFeedback);

function submitFeedback() {

    if (rating === 0) {

        document.getElementById("feedbackError").textContent =
            "Please provide a KT rating.";

        return;
    }

    document.getElementById("feedbackError").textContent = "";

    const feedback = {

        name: playerName,

        score: correctCount * 20,

        rating: rating,

        comments:
            document.getElementById("ktComments").value.trim(),

        suggestions:
            document.getElementById("suggestions").value.trim()
    };

    console.log("Feedback:", feedback);

    
       /*IMPORTANT:

       In the next phase this will be replaced with: */

       fetch("http://localhost:5000/feedback", {
           method: "POST",
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify(feedback)
       });

      /* The backend will send this information
       to Jenkins.
    */

    document.getElementById("thankYouName").textContent =
        feedback.name;

    document.getElementById("thankYouScore").textContent =
        `${feedback.score}/100`;

    showScreen("thankYouScreen");
}