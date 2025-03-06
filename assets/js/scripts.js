// Cache the DOM elements by assigning them to constants
const quizContainer = document.getElementById("quizContainer");
const comments = document.getElementById("comments");
const quizButton = document.getElementById("quizButton");
const reloadButton = document.getElementById("reloadButton");
const loadScriptButton = document.getElementById("loadScriptButton");
const totalScoreContainer = document.getElementById("totalScoreContainer");
const totalScoreElement = document.getElementById("totalScore");
const maxScoreElement = document.getElementById("maxScore");
const passMessage = document.getElementById("passMessage");
const countdownElement = document.getElementById("countdown");
const timeElement = document.getElementById("time");

// Set list of quiz types and initial score variables
const quizzes = ["biology", "astronomy", "geography", "history"];
let totalScore = 0;
let quizzesCompleted = 0;
let maxPossibleScore = 0;
let timer;

// Function to toggle visibility of elements
function toggleVisibility(elements, action) {
	elements.forEach((element) => {
		element.classList[action]("hidden");
	});
}

// Function to load all quizzes using a loop
function loadAllQuizzes() {
	const quizzes = ["biology", "astronomy", "geography", "history"];
	quizzes.forEach((quiz) => {
		loadQuiz(quiz, `${quiz}Form`, `${quiz}Score`);
	});
}

// Adding click event listener to the element with the ID "loadScriptButton"
loadScriptButton.addEventListener("click", getQuizContent);

// The getQuizContent() gets the quiz content from the forms on the page.
function getQuizContent() {
	toggleVisibility([quizContainer, reloadButton], "remove");
	toggleVisibility([comments, quizButton], "add");
	loadAllQuizzes();
	startCountdown();
}

/**
 *	The function loadQuiz fetches the quiz questions from a JSON file and displays
 *	them on the page. It also calculates the score and checks if the user has passed the test.
 */
function loadQuiz(quizType, formId, scoreId) {
	fetch(`assets/js/${quizType}.json`)
		.then((response) => response.json())
		.then((quiz) => {
			maxPossibleScore += quiz.length;

			let quizForm = document.getElementById(formId);
			let scoreElement = document.getElementById(scoreId);
			let currentQuestionIndex = 0;
			let score = 0;

			// Check if the event listener is already added
			if (!quizForm.dataset.listenerAdded) {
				quizForm.addEventListener("submit", function (event) {
					event.preventDefault();

					const selectedOption = document.querySelector(
						`input[name="${quizType}Question${currentQuestionIndex}"]:checked`
					);

					if (!selectedOption) {
						alert("Please select an answer!");
						return;
					}

					if (selectedOption.value === quiz[currentQuestionIndex].answer) {
						score++;
					}

					currentQuestionIndex++;

					if (currentQuestionIndex < quiz.length) {
						loadQuestion(quiz, quizType, currentQuestionIndex, quizForm);
					} else {
						totalScore += score;
						changeColor(score, quiz.length, scoreElement);
						scoreElement.textContent = `Unit score: ${score} out of ${quiz.length}`;
						quizzesCompleted++;

						if (quizzesCompleted === 1) {
							totalScoreContainer.classList.remove("hidden");
						}

						totalScoreElement.textContent = totalScore;
						maxScoreElement.textContent = maxPossibleScore;
						const passScore = Math.round(maxPossibleScore * 0.7);

						if (quizzesCompleted === quizzes.length) {
							totalScoreElement.classList.add("highlight");
							passMessage.classList.remove("hidden");
							changeColor(score, quiz.length, scoreElement);

							if (totalScore === maxPossibleScore) {
								passMessage.textContent = "You passed with the highest score! Congratulations!!!";
								passMessage.classList.add("green");
								stopCountdown();
							} else if (totalScore >= passScore) {
								passMessage.textContent = "You passed through the skin of your teeth... WoW!";
								passMessage.classList.add("orange");
								stopCountdown();
							} else {
								document.getElementById(
									"passMessage"
								).textContent = `Sorry, you didn't succeed as you need at least ${passScore} points to pass...`;
								passMessage.classList.add("redBorder");
								passMessage.innerHTML +=
									'<br><button onClick="resetQuiz()" class="reloadPageButton">Try again</button>';
								stopCountdown();
							}
						}
						quizForm.querySelector('input[type="submit"]').classList.add("hidden");
					}
				});

				// Mark that the event listener has been added
				quizForm.dataset.listenerAdded = true;
			}

			loadQuestion(quiz, quizType, currentQuestionIndex, quizForm);
		})
		.catch((error) => { // Catch any errors and log them to the console
			console.error(`Error loading ${quizType}.json: ${error}`);
		});
}

/**
 *	Function to display the score in different colors depending on the score.
 */
function changeColor(score, length, scoreElement) {
	if (score === length) {
		scoreElement.classList.add("green");
	} else if (score == length - 1) {
		scoreElement.classList.add("blue");
	} else {
		scoreElement.classList.add("redBorder");
	}
}

/**
 *	Function to display the next question.
 *	It clears the form, gets the current question and formats the
 *	html presentation of the questions and  appends the question
 *	to the form.
 */
function loadQuestion(quiz, quizType, currentQuestionIndex, quizForm) {
	quizForm.innerHTML = "";
	const q = quiz[currentQuestionIndex];

	// Display current question
	const questionElement = document.createElement("ul");
	questionElement.innerHTML = `<h4>${q.question}</h4>`;

	// Create radio buttons for each option from the array of questions
	q.options.forEach((option) => {
		questionElement.innerHTML += `<li><input type="radio" id="${quizType}Question${currentQuestionIndex}${option}" name="${quizType}Question${currentQuestionIndex}" value="${option}"> <label for="${quizType}Question${currentQuestionIndex}${option}">${option}</label></li>`;
	});
	quizForm.appendChild(questionElement);

	// Create the submit button
	const submitButton = document.createElement("input");
	submitButton.type = "submit";
	submitButton.value = `Check your ${quizType}`;
	quizForm.appendChild(submitButton);
}

/**
 *	Function to start the countdown timer.
 *	It sets the default countdown value is set to 60 seconds
 *	and handles the case when user runs out of time:
 *	hide the comments, hide the quiz button, hide the quiz button
 *	or hide the whole quizContainer
 *	Note that value 1000 for speed equals to 1 minute.
 */
function startCountdown() {
	countdownElement.classList.remove("hidden");
	let timeLeft = 60;

	timer = setInterval(() => {
		timeLeft--;
		timeElement.textContent = timeLeft;

		if (timeLeft <= 0) {
			clearInterval(timer);
			quizContainer.classList.add("hidden");
			comments.classList.remove("hidden");
			quizButton.classList.remove("hidden");
			countdownElement.classList.add("hidden");
			alert("Time is up! Sorry, The quiz has ended. Let's try again!");
			resetQuiz();
		}
	}, 1000);
}

/**
 *	Function to stop the countdown timer with the goal
 *	to move focus to the top of the page so that the user
 *	cas see his final score
 */
function stopCountdown() {
	clearInterval(timer);
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// Adding click event listener to the element with the ID "reloadButton"
reloadButton.addEventListener("click", resetQuiz);
/**
 *	Function to reset the quiz to the initial state
 */
function resetQuiz() {
	location.reload();
}
