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
        if (data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text) {
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

document.addEventListener('DOMContentLoaded', function() {
    const chatLog = document.getElementById('chat-log');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Function to append a message to the chat log.
    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        const messageTextDiv = document.createElement('div');
        messageTextDiv.classList.add('message-text');
        messageTextDiv.textContent = text;
        messageDiv.appendChild(messageTextDiv);
        chatLog.appendChild(messageDiv);
        // Scroll the chat log to the bottom.
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Function to send a message and receive the bot's response.
    async function sendMessage() {
        const message = userMessageInput.value.trim();
        if (!message) {
            return;
        }

        // Append the user's message.
        appendMessage('user', message);
        userMessageInput.value = '';

        // Show loading indicator while waiting for the bot's response.
        loadingIndicator.style.display = 'block';

        try {
            // Prepare a prompt that instructs the API to act as a helpful chatbot.
            const prompt = `You are a helpful chatbot. Respond to the following message: "${message}"`;
            const botResponse = await callGeminiAPI(prompt);
            appendMessage('bot', botResponse);
        } catch (error) {
            appendMessage('bot', 'Sorry, there was an error processing your request.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});