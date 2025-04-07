// Function to call the Gemini API
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyBh99Ip-EIdRsrlovksEYdefaWHyRioSzM'; // Replace with your actual API key
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (
            data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text
        ) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response format:", data);
            throw new Error("Unexpected API response format");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Add event listener for the Solve Question page
document.addEventListener('DOMContentLoaded', function() {
    const solveButton = document.getElementById('solve-button');
    const questionInput = document.getElementById('user-question');
    const solutionContainer = document.getElementById('solution-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    solveButton.addEventListener('click', async function() {
        const userQuestion = questionInput.value.trim();
        if (!userQuestion) {
            alert("Please enter a question.");
            return;
        }

        // Show the loading indicator and clear previous results
        loadingIndicator.style.display = 'block';
        solutionContainer.innerHTML = "";

        // Check if the question is math or physics related by looking for keywords
        const lowerQuestion = userQuestion.toLowerCase();
        let prompt;
        if (lowerQuestion.includes("math") ||
            lowerQuestion.includes("calculate") ||
            lowerQuestion.includes("solve") ||
            lowerQuestion.includes("equation") ||
            lowerQuestion.includes("physics") ||
            lowerQuestion.includes("force") ||
            lowerQuestion.includes("velocity") ||
            lowerQuestion.includes("acceleration")) {
          prompt = `Solve the following question step by step and provide a detailed explanation of each step:\n\nQuestion: ${userQuestion}\n\nAnswer:`;
        } else {
          prompt = `Solve the following question and provide a very detailed explanation of your answer:\n\nQuestion: ${userQuestion}\n\nAnswer:`;
        }

        try {
            const solutionText = await callGeminiAPI(prompt);
            // Split the solution text by newline and wrap each segment in a paragraph
            const paragraphs = solutionText
              .split('\n')
              .filter(line => line.trim() !== '')
              .map(line => `<p>${line.trim()}</p>`)
              .join('');
            solutionContainer.innerHTML = paragraphs;
        } catch (error) {
            solutionContainer.innerHTML = `<p>Error generating solution. Please try again later.</p>`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });
});
