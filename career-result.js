document.addEventListener('DOMContentLoaded', function() {
    const guidanceResult = document.getElementById('guidance-result');
    // Retrieve the guidance result from localStorage
    const guidance = localStorage.getItem('careerGuidance');
    if (guidance) {
        guidanceResult.textContent = guidance;
    } else {
        guidanceResult.textContent = "No guidance available. Please try again.";
    }

    // Add an event listener for the back button to return to the form
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'career.html';
    });
});
