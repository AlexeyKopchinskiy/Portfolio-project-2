// Function that gets the quiz content from the forms on the page
// and displays the quiz score
function getQuizContent() {
	// console.log("getQuizContent() called"); // Check if the function is called
	// Set list of quiz types and initial score variables
	const quizzes = ["biology", "astronomy", "geography", "history"]; // List of quiz types
	let totalScore = 0; // Total score of the user
	let quizzesCompleted = 0; // Number of quizzes completed
	let maxPossibleScore = 0; // Maximum possible score
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
