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
const ALERT_SELECT_ANSWER = "Please select an answer!";
const MESSAGE_TIME_UP = "Time is up! Sorry, The quiz has ended. Let's try again!";

// Set list of quiz types and initial score variables
const quizzes = ["biology", "astronomy", "geography", "history", "sports", "pop"];
let totalScore = 0;
let quizzesCompleted = 0;
let maxPossibleScore = 0;
let timer;

// Helper function to toggle visibility of elements
function toggleVisibility(elements, action) {
	elements.forEach((element) => {
		element.classList[action]("hidden");
	});
}

// Function to load all quizzes using a loop
function loadAllQuizzes() {
	// const quizzes = ["biology", "astronomy", "geography", "history"];
	quizzes.forEach((quiz) => {
		loadQuiz(quiz, `${quiz}Form`, `${quiz}Score`);
	});
}

// Helper function to shuffle an array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Helper function that selects a specified number (n) of random items from an array
function getRandomSubset(array, n) {
	const shuffled = shuffleArray(array);
	return shuffled.slice(0, n);
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

// displayCorrectAnswers function loops through the quiz array and dynamically 
// generates a list of correct answers to display below the quiz:
function displayCorrectAnswers(quiz, quizForm) {
	const answersContainer = document.createElement("div");
	answersContainer.classList.add("answers-container");

	answersContainer.innerHTML = "<h3>Correct Answers:</h3>";

	quiz.forEach((question, index) => {
		// Create a block for each question and its correct answer
		const questionBlock = document.createElement("div");
		questionBlock.classList.add("question-block"); // Assign class for further styling

		// Add the question text
		const questionText = document.createElement("p");
		questionText.classList.add("question-text"); // Assign class for styling
		questionText.textContent = `Question ${index + 1}: ${question.question}`;

		// Add the correct answer text
		const answerText = document.createElement("p");
		answerText.classList.add("answer-text"); // Assign class for styling
		answerText.textContent = `Correct Answer: ${question.answer}`;

		// Append both the question and the answer to the block
		questionBlock.appendChild(questionText);
		questionBlock.appendChild(answerText);

		// Append the block to the container
		answersContainer.appendChild(questionBlock);
	});

	// Append the answers container to the quiz form
	quizForm.appendChild(answersContainer);
}




/**
 *	The function loadQuiz fetches the quiz questions from a JSON file and displays
 *	them on the page. It also calculates the score and checks if the user has passed the test.
 */
function loadQuiz(quizType, formId, scoreId) {
	fetch(`assets/js/${quizType}.json`)
		.then((response) => response.json())
		.then((quiz) => {
			// Shuffle the questions

			// Select only 3 random questions
			quiz = getRandomSubset(quiz, 3);

			// Shuffle the answers for each question
			quiz.forEach((question) => {
				question.options = shuffleArray(question.options);
			});

			maxPossibleScore += quiz.length;

			let quizForm = document.getElementById(formId);
			let scoreElement = document.getElementById(scoreId);
			let currentQuestionIndex = 0;
			let score = 0;

			// Check if the event listener is already added and if not,
			// add the event listener to the form to handle the quiz submission
			if (!quizForm.dataset.listenerAdded) {
				quizForm.addEventListener("submit", function (event) {
					event.preventDefault();

					const selectedOption = document.querySelector(
						`input[name="${quizType}Question${currentQuestionIndex}"]:checked`
					);

					if (!selectedOption) {
						alert(ALERT_SELECT_ANSWER);
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

						// Display correct answers
						displayCorrectAnswers(quiz, quizForm);

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
		.catch((error) => {
			// Catch any errors and log them to the console
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
	let timeLeft = 120;

	timer = setInterval(() => {
		timeLeft--;
		timeElement.textContent = timeLeft;

		if (timeLeft <= 0) {
			clearInterval(timer);
			quizContainer.classList.add("hidden");
			comments.classList.remove("hidden");
			quizButton.classList.remove("hidden");
			countdownElement.classList.add("hidden");
			// alert("Time is up! Sorry, The quiz has ended. Let's try again!");
			alert(MESSAGE_TIME_UP);
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
