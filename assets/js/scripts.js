// Function that gets the quiz content from the forms on the page
// and displays the quiz score
function getQuizContent() {
	// console.log("getQuizContent() called"); // Check if the function is called
	// Set list of quiz types and initial score variables
	const quizzes = ["biology", "astronomy", "geography", "history"]; // List of quiz types
	let totalScore = 0; // Total score of the user
	let quizzesCompleted = 0; // Number of quizzes completed
	let maxPossibleScore = 0; // Maximum possible score

	// Function to shuffle an array (Fisher-Yates algorithm)
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	// Function to load a quiz
	function loadQuiz(quizType, formId, scoreId) {
		// Fetch quiz questions from the JSON files
		// amd display them on the page
		fetch(`assets/js/${quizType}.json`)
			.then((response) => response.json()) // Parse the JSON data
			.then((quiz) => {
				maxPossibleScore += quiz.length; // Add the number of questions to the maximum possible score
				const quizForm = document.getElementById(formId); // Get the form element
				const scoreElement = document.getElementById(scoreId); // Get the score element
				let currentQuestionIndex = 0; // Index of the current question
				let score = 0; // Score of the user for the current quiz

				// Function to display the next question
				function loadQuestion() {
					quizForm.innerHTML = ""; // Clear the form
					const q = quiz[currentQuestionIndex]; // Get the current question

					shuffleArray(q.options); // Shuffle the questioms so that they disply randomly

					const questionElement = document.createElement("div"); // Create a div element for the question
					questionElement.innerHTML = `<label>${q.question}</label><br>`; // Display current question

					// Create radio buttons for each option from the aray of questions
					q.options.forEach((option) => {
						questionElement.innerHTML += `<input type="radio" id="${quizType}Question${currentQuestionIndex}${option}" name="${quizType}Question${currentQuestionIndex}" value="${option}"> <label for="${quizType}Question${currentQuestionIndex}${option}">${option}</label><br>`;
					});
					quizForm.appendChild(questionElement); // Append the question to the form

					// Create the submit button
					const submitButton = document.createElement("input");
					submitButton.type = "submit";
					submitButton.value = "Submit Answer";
					quizForm.appendChild(submitButton);
				}

				// Event listener for form submission
				quizForm.addEventListener("submit", function (event) {
					event.preventDefault(); // Prevent the form from submitting

					// Check if an option is selected
					const selectedOption = document.querySelector(
						`input[name="${quizType}Question${currentQuestionIndex}"]:checked`
					);
					if (!selectedOption) {
						alert("Please select an answer!");
						return;
					}

					// Check if the selected option is correct
					// and increment the score if it is
					if (selectedOption.value === quiz[currentQuestionIndex].answer) {
						score++;
					}
					currentQuestionIndex++; // Move to the next question

					// Checking the progress of the quiz:
					// Load the next question or finish the quiz if all questions have been answered
					if (currentQuestionIndex < quiz.length) {
						loadQuestion();
					} else {
						// Update the total score and display the score for the current quiz
						totalScore += score;
						scoreElement.textContent = `Your score: ${score}`; // Display the score
						quizzesCompleted++; // Increment the number of quizzes completed
						// Display the total score container after the first quiz
						if (quizzesCompleted === 1) {
							document.getElementById("totalScoreContainer").classList.remove("hidden");
						}

						document.getElementById("totalScore").textContent = totalScore; // Display the total score
						document.getElementById("maxScore").textContent = maxPossibleScore; // Display the maximum possible score
						const passScore = maxPossibleScore - 1; // Set the passing score to be one less than the maximum possible score

						// Display a message if the user cannot pass the test
						// while completing the quiz
						// the idea is that if the current score is already too low, it makes no sence to continue
						// However if the user wants he/she can continue anyway
						if (
							totalScore + (maxPossibleScore - quiz.length) < passScore &&
							quizzesCompleted === 1
						) {
							const failMessage = document.createElement("p"); // Create a paragraph element for the message
							failMessage.textContent =
								"You will not pass the test even if you finish the rest with the maximum score. However, you may continue if you wish.";
							failMessage.classList.add("orange"); // Add the orange class to the message
							quizForm.appendChild(failMessage); // Append the message to the form

							// Create the reset button
							const tryAgainButton = document.createElement("button"); // Create a button element for the reset button
							tryAgainButton.textContent = "Try again"; // Set the text content of the button
							tryAgainButton.classList.add("orange"); // Add the orange class to the button
							tryAgainButton.addEventListener("click", resetQuizzes); // Add an event listener to the button
							quizForm.appendChild(tryAgainButton); // Append the button to the form
						}

						// Display the final message after all quizzes are completed
						if (quizzesCompleted === quizzes.length) {
						}
					}
				});

				loadQuestion(); // Load the next question
			});
	}

	// Load quizzes
	loadQuiz("biology", "biologyForm", "biologyScore");
	loadQuiz("astronomy", "astronomyForm", "astronomyScore");
	loadQuiz("geography", "geographyForm", "geographyScore");
	loadQuiz("history", "historyForm", "historyScore");
}

// Event to initiate the quiz when the page loads
// But first check whether loading has been completed
if (document.readyState === "loading") {
	// Loading isn't finished
	document.addEventListener("DOMContentLoaded", getQuizContent());
} else {
	// `DOMContentLoaded` has been fired
	getQuizContent();
}
