// Function that gets the quiz content from the forms on the page
// and displays the quiz score
function getQuizContent() {
	// console.log("getQuizContent() called"); // Check if the function is called
	// Set list of quiz types and initial score variables
	const quizzes = ["biology", "astronomy", "geography", "history"]; // List of quiz types
	let totalScore = 0; // Total score of the user
	let quizzesCompleted = 0; // Number of quizzes completed
	let maxPossibleScore = 0; // Maximum possible score

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
				}
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
	document.addEventListener("DOMContentLoaded", getQuizContent);
} else {
	// `DOMContentLoaded` has been fired
	getQuizContent();
}
