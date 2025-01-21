// Function that gets the quiz content from the forms on the page
// and displays the quiz score
function getQuizContent() {
	console.log("getQuizContent() called");
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
