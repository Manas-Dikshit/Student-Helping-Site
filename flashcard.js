// Function to call the Gemini API with a prompt and return the generated content.
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyBh99Ip-EIdRsrlovksEYdefaWHyRioSzM'; // Your API Key
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

// Function to generate 10 short notes about a topic.
async function getShortNotes(topic) {
    // Instruct the API to generate 10 concise notes separated by the delimiter "|||"
    const prompt = `Generate 10 short notes about "${topic}". Each note should be concise and informative. Separate each note using the delimiter "|||".`;
    try {
        const notesText = await callGeminiAPI(prompt);
        // Split the returned text by the delimiter "|||"
        const notes = notesText.split("|||").map(note => note.trim()).filter(note => note);
        return notes;
    } catch (error) {
        console.error("Error in getShortNotes:", error);
        return ["Sorry, we could not generate notes at this time."];
    }
}

// Helper functions to show and hide the loading indicator.
function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// DOMContentLoaded event listener to wire up the button click.
document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-note');
    const topicInput = document.getElementById('note-topic');
    const noteResultDiv = document.getElementById('note-result');

    generateButton.addEventListener('click', async function() {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert("Please enter a topic.");
            return;
        }

        // Clear previous notes and show loading indicator
        noteResultDiv.innerHTML = "";
        showLoadingIndicator();

        // Call the function to get the notes.
        const notes = await getShortNotes(topic);
        
        // Display each note in a separate box.
        let html = '';
        notes.forEach(note => {
            html += `<div class="note-box">${note}</div>`;
        });
        noteResultDiv.innerHTML = html;
        hideLoadingIndicator();
    });
});