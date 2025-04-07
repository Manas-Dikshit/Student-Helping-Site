// Particle Animation
function createParticles() {
    const particles = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5}px;
            height: ${Math.random() * 5}px;
            background: rgba(100, 108, 255, ${Math.random() * 0.5});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        particles.appendChild(particle);
    }
}

// Chatbot functionality
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');
const voiceButton = document.getElementById('voiceInput');

const responses = {
    hello: "Hi! How can I help you with your studies today?",
    help: "I can help you with study notes, homework, or answer any questions you have!",
    study: "Let's create a study plan together. What subject would you like to focus on?",
    default: "I'm here to help! Could you please be more specific about what you need?"
};

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.style.cssText = `
        margin: 10px;
        padding: 10px;
        border-radius: 15px;
        background: ${isUser ? 'rgba(100, 108, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
        max-width: 80%;
        ${isUser ? 'margin-left: auto;' : ''}
    `;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    return responses.default;
}

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        setTimeout(() => {
            addMessage(getBotResponse(message));
        }, 500);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Initialize animations and event listeners
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Add hover effect to feature cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 0 20px rgba(100, 108, 255, 0.3)';
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});