// Set list of quiz types and initial score variables
const quizzes = ["biology", "astronomy", "geography", "history"]; // List of quiz types
let totalScore = 0; // Total score of the user
let quizzesCompleted = 0; // Number of quizzes completed
let maxPossibleScore = 0; // Maximum possible score

// Function to shuffle an array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/*
	The getQuizContent() is the main function that gets the quiz content from the forms on the page.
	It displays the quiz score and the total score of the user.
	The function also checks if the user has passed the test and displays a message accordingly.
	The function also allows the user to reset the quizzes and start again.
*/
function getQuizContent() {
	/* 
		Function to load a quiz quizType: the type of quiz to load
		formId: the ID of the form element scoreId: the ID of the score element
		The function fetches the quiz questions from a JSON file and displays them on the page
		The function also calculates the score of the user and displays it on the page
		The function also checks if the user has passed the test
	*/
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
					questionElement.innerHTML = `<h4>${q.question}</h4>`; // Display current question

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
						// Display achieved score in different colors depending on the score
						if (score === quiz.length) {
							scoreElement.classList.add("green");
						} else if (score == quiz.length - 1) {
							scoreElement.classList.add("orange");
						} else {
							scoreElement.classList.add("red");
						}
						scoreElement.textContent = `Your score: ${score} out of ${quiz.length}`; // Display the score
						quizzesCompleted++; // Increment the number of quizzes completed
						// Display the total score container after the first quiz
						if (quizzesCompleted === 1) {
							document.getElementById("totalScoreContainer").classList.remove("hidden");
						}

						document.getElementById("totalScore").textContent = totalScore; // Display the total score
						document.getElementById("maxScore").textContent = maxPossibleScore; // Display the maximum possible score
						const passScore = maxPossibleScore - 1; // Set the passing score to be one less than the maximum possible score

						// Display the final message after all quizzes are completed
						if (quizzesCompleted === quizzes.length) {
							document.getElementById("totalScore").classList.add("highlight"); // Highlight the total score
							document.getElementById("resetButton").classList.remove("hidden"); // Display the reset button
							document.getElementById("passMessage").classList.remove("hidden"); // Hide the pass message
							if (score === quiz.length) {
								passMessage.classList.add("green");
							} else if (score == quiz.length - 1) {
								passMessage.classList.add("orange");
							} else {
								passMessage.classList.add("red");
							}
							// Display the pass message
							if (totalScore >= passScore) {
								document.getElementById("passMessage").textContent = "You passed!";
							} else {
								document.getElementById(
									"passMessage"
								).textContent = `Sorry, you didn't succeed as you need at least ${passScore} points to pass...`;
							}
						}
						// Hide the submit button after the quiz is completed
						quizForm.querySelector('input[type="submit"]').classList.add("hidden");
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
