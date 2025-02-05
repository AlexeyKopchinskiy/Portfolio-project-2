// Set list of quiz types and initial score variables
const quizzes = ["biology", "astronomy", "geography", "history"]; // List of quiz types
let totalScore = 0; // Total score of the user
let quizzesCompleted = 0; // Number of quizzes completed
let maxPossibleScore = 0; // Maximum possible score
let timer; // Timer for the countdown

/*
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

/** Check loadQuiz function for possible errors */
try {
	loadQuiz();
} catch (error) {
	console.error(error);
}

/* 
	Function to load a quiz quizType: the type of quiz to load
	formId: the ID of the form element scoreId: the ID of the score element
	The function fetches the quiz questions from a JSON file and displays them on the page
	The function also calculates the score of the user and displays it on the page
	The function also checks if the user has passed the test
*/
function loadQuiz(quizType, formId, scoreId) {
	// Fetch quiz questions from the JSON files
	// and display them on the page
	fetch(`assets/js/${quizType}.json`)
		.then((response) => response.json()) // Parse the JSON data
		.then((quiz) => {
			maxPossibleScore += quiz.length; // Make the maximum possible score equal to the number of quiz questions
			let quizForm = document.getElementById(formId); // Get the form element
			let scoreElement = document.getElementById(scoreId); // Get the score element
			let currentQuestionIndex = 0; // Index of the current question
			let score = 0; // Score of the user for the current quiz
			/*
				Event listener for the form submission
				Check if an option is selected and if it is correct
				Increment the score and load the next question or finish the quiz if all questions have been answered
				Display the score and the total score
				Display a message if the user has passed the test
				Display a message if the user cannot pass the test
				Display the final message after all quizzes are completed
				Hide the submit button after the quiz is completed
				Display the total score container after the first quiz
				Display the reset button after all quizzes are completed
				Display the pass message after all quizzes are completed
				Display the total score after all quizzes are completed
				Display the maximum possible score after all quizzes are completed
				Display the pass message after all quizzes are completed
			*/
			quizForm.addEventListener("submit", function (event) {
				event.preventDefault(); // Prevent the form from submitting

				// Check if an option is selected
				const selectedOption = document.querySelector(
					`input[name="${quizType}Question${currentQuestionIndex}"]:checked`
				);

				// Alert if it is not
				if (!selectedOption) {
					alert("Please select an answer!");
					return;
				}

				// Check if the selected option is correct
				// and increment the score if it is
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
					// window.scrollTo({ top: 0, behavior: "smooth" });

					// Update the total score and display the score for the current quiz
					totalScore += score;

					// Display achieved score in different colors depending on the score
					changeColor(score, quiz.length, scoreElement);

					scoreElement.textContent = `Unit score: ${score} out of ${quiz.length}`; // Display the score
					quizzesCompleted++; // Increment the number of quizzes completed
					// Display the total score container after the first quiz
					if (quizzesCompleted === 1) {
						document.getElementById("totalScoreContainer").classList.remove("hidden");
					}

					document.getElementById("totalScore").textContent = totalScore; // Display the total score
					document.getElementById("maxScore").textContent = maxPossibleScore; // Display the maximum possible score
					const passScore = maxPossibleScore - 2; // Set the passing score to be one less than the maximum possible score

					// Display the final message after all quizzes are completed
					if (quizzesCompleted === quizzes.length) {
						document.getElementById("totalScore").classList.add("highlight"); // Highlight the total score
						document.getElementById("passMessage").classList.remove("hidden"); // Show the pass message

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

			loadQuestion(quiz, quizType, currentQuestionIndex, quizForm); // Load the next question
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

// Function to display the next question
function loadQuestion(quiz, quizType, currentQuestionIndex, quizForm) {
	quizForm.innerHTML = ""; // Clear the form
	const q = quiz[currentQuestionIndex]; // Get the current question

	const questionElement = document.createElement("ul"); // Create a section element for the set of question
	questionElement.innerHTML = `<h4>${q.question}</h4>`; // Display current question

	// Create radio buttons for each option from the array of questions
	q.options.forEach((option) => {
		questionElement.innerHTML += `<li><input type="radio" id="${quizType}Question${currentQuestionIndex}${option}" name="${quizType}Question${currentQuestionIndex}" value="${option}"> <label for="${quizType}Question${currentQuestionIndex}${option}">${option}</label></li>`;
	});
	quizForm.appendChild(questionElement); // Append the question to the form

	// Create the submit button
	const submitButton = document.createElement("input");
	submitButton.type = "submit";
	submitButton.value = `Check your ${quizType}`;
	quizForm.appendChild(submitButton);
}

// Function to start the countdown timer
function startCountdown() {
	const countdownElement = document.getElementById("countdown");
	const timeElement = document.getElementById("time");
	let timeLeft = 60; // 60 seconds countdown

	countdownElement.classList.remove("hidden");

	timer = setInterval(() => {
		timeLeft--;
		timeElement.textContent = timeLeft;
		// Handle the case when user runs out of time
		if (timeLeft <= 0) {
			clearInterval(timer);
			document.getElementById("quizContainer").classList.add("hidden");
			document.getElementById("comments").classList.remove("hidden"); // Hide the comments
			document.getElementById("quizButton").classList.remove("hidden"); // Hide the quiz button
			document.getElementById("countdown").classList.add("hidden"); // Hide the quiz button
			alert("Time is up! Sorrry, The quiz has ended. Let's try again!");
			resetQuiz();
		}
	}, 1000); /* 1000 speed equals to 1 minute */
}

// Function to stop the countdown timer
function stopCountdown() {
	clearInterval(timer);
	// Move focus to the top of the page so that the user cas see his final score
	window.scrollTo({ top: 0, behavior: "smooth" });
}

// Function to reset the quiz to the initial state
function resetQuiz() {
	location.reload();
}
