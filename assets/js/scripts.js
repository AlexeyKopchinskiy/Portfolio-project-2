/**
	Set list of quiz types and initial score variables:
	List of quiz types, total score of the user, number 
	of quizzes completed, maximum possible score and Timer
	for the countdown
*/
const quizzes = ["biology", "astronomy", "geography", "history"];
let totalScore = 0;
let quizzesCompleted = 0;
let maxPossibleScore = 0;
let timer;

/**
	The getQuizContent() is the main function that gets the quiz content from the forms on the page.
	It displays the quiz score and the total score of the user.
	The function also checks if the user has passed the test and displays a message accordingly.
	The function also allows the user to reset the quizzes and start again.
*/
function getQuizContent() {
	document.getElementById("quizContainer").classList.remove("hidden");
	document.getElementById("comments").classList.add("hidden");
	document.getElementById("quizButton").classList.add("hidden");
	document.getElementById("reloadButton").classList.remove("hidden");

	// Load quizzes with anchors to the corresponding form on the index.html page
	loadQuiz("biology", "biologyForm", "biologyScore");
	loadQuiz("astronomy", "astronomyForm", "astronomyScore");
	loadQuiz("geography", "geographyForm", "geographyScore");
	loadQuiz("history", "historyForm", "historyScore");
	startCountdown();
}

//	Check loadQuiz function for possible errors
try {
	loadQuiz();
} catch (error) {
	console.error(error);
}

/** 
	The function fetches the quiz questions from a JSON file and displays them on the page. 
	It also calculates the score and checks if the user has passed the test. 
*/
function loadQuiz(quizType, formId, scoreId) {
	// Fetch quiz questions from the JSON files
	// and display them on the page
	fetch(`assets/js/${quizType}.json`)
		.then((response) => response.json())
		.then((quiz) => {
			maxPossibleScore += quiz.length;
			let quizForm = document.getElementById(formId);
			let scoreElement = document.getElementById(scoreId);
			let currentQuestionIndex = 0;
			let score = 0;

			quizForm.addEventListener("submit", function (event) {
				event.preventDefault();

				// Check if an option is selected
				const selectedOption = document.querySelector(
					`input[name="${quizType}Question${currentQuestionIndex}"]:checked`
				);

				// Alert if it is not
				if (!selectedOption) {
					alert("Please select an answer!");
					return;
				}

				// Check if the selected option is correct and increment the score if it is
				if (selectedOption.value === quiz[currentQuestionIndex].answer) {
					score++;
				}

				// Move to the next question
				currentQuestionIndex++;

				// Checking the progress of the quiz:
				// Load the next question or finish the quiz if all questions have been answered
				if (currentQuestionIndex < quiz.length) {
					loadQuestion(quiz, quizType, currentQuestionIndex, quizForm);
				} else {
					// Update the total score and display the score for the current quiz
					totalScore += score;

					// Display achieved score in different colors depending on the score
					changeColor(score, quiz.length, scoreElement);

					scoreElement.textContent = `Unit score: ${score} out of ${quiz.length}`;
					quizzesCompleted++;

					if (quizzesCompleted === 1) {
						document.getElementById("totalScoreContainer").classList.remove("hidden");
					}

					document.getElementById("totalScore").textContent = totalScore;
					document.getElementById("maxScore").textContent = maxPossibleScore;
					const passScore = maxPossibleScore - 2;

					// Display the final message after all quizzes are completed
					if (quizzesCompleted === quizzes.length) {
						document.getElementById("totalScore").classList.add("highlight");
						document.getElementById("passMessage").classList.remove("hidden");

						// Display achieved score in different colors depending on the score
						changeColor(score, quiz.length, scoreElement);

						// Display the pass message
						if (totalScore === maxPossibleScore) {
							document.getElementById("passMessage").textContent =
								"You passed with the highest score! Congratulations!!!";
							document.getElementById("passMessage").classList.add("green");
							stopCountdown();
						} else if (totalScore >= maxPossibleScore - 2) {
							document.getElementById("passMessage").textContent =
								"You passed through the skin of your teeth... WoW!";
							document.getElementById("passMessage").classList.add("orange");
							stopCountdown();
						} else {
							document.getElementById(
								"passMessage"
							).textContent = `Sorry, you didn't succeed as you need at least ${passScore} points to pass...`;
							document.getElementById("passMessage").classList.add("redBorder");
							document.getElementById("passMessage").innerHTML +=
								'<br><button onClick="resetQuiz()" class="roloadPageButton">Try again</button>';
							stopCountdown();
						}
					}
					// Hide the submit button after the quiz is completed
					quizForm.querySelector('input[type="submit"]').classList.add("hidden");
				}
			});

			// Load the next question
			loadQuestion(quiz, quizType, currentQuestionIndex, quizForm);
		});
}

/**
	Function to display the score in different colors depending on the score.
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
	Function to display the next question.
	It clears the form, gets the current question and formats the 
	html presentation of the questions and  appends the question 
	to the form. 
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
	Function to start the countdown timer. 
	It sets the default countdown value is set to 60 seconds
	and handles the case when user runs out of time:
	hide the comments, hide the quiz button, hide the quiz button
	or hide the whole quizContainer
	Note that value 1000 for speed equals to 1 minute.
*/
function startCountdown() {
	const countdownElement = document.getElementById("countdown");
	const timeElement = document.getElementById("time");
	let timeLeft = 60;

	countdownElement.classList.remove("hidden");

	timer = setInterval(() => {
		timeLeft--;
		timeElement.textContent = timeLeft;

		if (timeLeft <= 0) {
			clearInterval(timer);
			document.getElementById("quizContainer").classList.add("hidden");
			document.getElementById("comments").classList.remove("hidden");
			document.getElementById("quizButton").classList.remove("hidden");
			document.getElementById("countdown").classList.add("hidden");
			alert("Time is up! Sorrry, The quiz has ended. Let's try again!");
			resetQuiz();
		}
	}, 1000);
}

/**
	Function to stop the countdown timer with the goal 
	to move focus to the top of the page so that the user 
	cas see his final score
*/
function stopCountdown() {
	clearInterval(timer);
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
	Function to reset the quiz to the initial state
*/
function resetQuiz() {
	location.reload();
}
