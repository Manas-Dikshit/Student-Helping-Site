// Function to call the Gemini API (update the API key accordingly)
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
        if (data && data.candidates && data.candidates[0] &&
            data.candidates[0].content && data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
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

// Function to generate career guidance based on the user's inputs
async function getCareerGuidance(academicLevel, favoriteHobby, strangePoints) {
    const prompt = `Based on the following information, provide detailed career guidance:
Academic Level: ${academicLevel}
Favorite Hobby: ${favoriteHobby}
Unique Strengths/Interests: ${strangePoints}

Please analyze these inputs and suggest potential career paths with reasons why these careers might be a good fit.`;
    try {
        const guidance = await callGeminiAPI(prompt);
        return guidance;
    } catch (error) {
        console.error("Error getting career guidance:", error);
        return "Could not generate career guidance at this time.";
    }
}

// Helper functions to show and hide the loading indicator
function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    const careerForm = document.getElementById('career-form');

    careerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        // Get input values
        const academicLevel = document.getElementById('academic-level').value;
        const favoriteHobby = document.getElementById('favorite-hobby').value.trim();
        const strangePoints = document.getElementById('strange-points').value.trim();

        if (!academicLevel || !favoriteHobby || !strangePoints) {
            alert("Please fill out all fields.");
            return;
        }

        showLoadingIndicator();
        try {
            const guidance = await getCareerGuidance(academicLevel, favoriteHobby, strangePoints);
            // Save the guidance to localStorage and navigate to the result page
            localStorage.setItem('careerGuidance', guidance);
            window.location.href = 'career-result.html';
        } catch (error) {
            alert("An error occurred while fetching career guidance.");
        } finally {
            hideLoadingIndicator();
        }
    });
});
