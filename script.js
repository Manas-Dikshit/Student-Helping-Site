// --- Utility Functions ---

// Function to handle API calls (using fetch and async/await)
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
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
           return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response format:", data);
            throw new Error("Unexpected API response format");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// Function to get subtopics from the Gemini API
async function getSubtopics(topic, gradeLevel) {
    const prompt = `Generate 3-5 subtopics related to '${topic}' that would be appropriate for a ${gradeLevel} student. Return the subtopics as a comma-separated list.`;
    try {
        const subtopicsText = await callGeminiAPI(prompt);
        const subtopics = subtopicsText.split(',').map(s => s.trim());
        return [...new Set(subtopics)]; // Remove duplicates
    } catch (error) {
        console.error("Error in getSubtopics:", error);
        return []; // Return an empty array on error
    }
}

// Function to generate questions from the Gemini API
async function getQuestions(subtopic, gradeLevel) {
    const prompt = `Generate 5 multiple-choice questions about '${subtopic}' suitable for a ${gradeLevel} student. 
    Each question should have 4 options (A, B, C, D) with one correct answer.
    Return the questions in JSON format with a "questions" key containing an array of objects. 
    Each object should have "question", "options" (with keys "A", "B", "C", "D"), and "correctAnswer" (one of "A", "B", "C", "D").`;

    try {
        const responseText = await callGeminiAPI(prompt);
        console.log("Raw API Response:", responseText); // Log the raw response

        // Clean the response by removing any non-JSON content
        const jsonStartIndex = responseText.indexOf('{');
        const jsonEndIndex = responseText.lastIndexOf('}') + 1;
        const cleanResponseText = responseText.substring(jsonStartIndex, jsonEndIndex);

        try {
            const questionsData = JSON.parse(cleanResponseText);
            console.log("questionsData", questionsData); // add this
            return questionsData.questions;
        } catch (jsonError) {
            console.error("Error parsing JSON response from API:", jsonError, cleanResponseText);

            // Fallback: Try to extract questions using regular expressions (less reliable)
            const questionRegex = /Question \d+: (.*?)\nOptions: (.*?)\nCorrect Answer: ([A-D])/g;
            let match;
            const extractedQuestions = [];

            const lines = cleanResponseText.split('\n');
            let currentQuestion = null;

            for (const line of lines) {
                if (line.startsWith('Question')) {
                    if (currentQuestion) {
                        extractedQuestions.push(currentQuestion);
                    }
                    currentQuestion = { question: line.substring(line.indexOf(':') + 1).trim(), options: {}, correctAnswer: null };
                } else if (line.trim().startsWith('A:') && currentQuestion) {
                    currentQuestion.options['A'] = line.trim().substring(2).trim();
                } else if (line.trim().startsWith('B:') && currentQuestion) {
                    currentQuestion.options['B'] = line.trim().substring(2).trim();
                } else if (line.trim().startsWith('C:') && currentQuestion) {
                    currentQuestion.options['C'] = line.trim().substring(2).trim();
                } else if (line.trim().startsWith('D:') && currentQuestion) {
                    currentQuestion.options['D'] = line.trim().substring(2).trim();
                } else if (line.includes('Correct Answer:') && currentQuestion) {
                    currentQuestion.correctAnswer = line.trim().substring(line.trim().indexOf(':') + 1).trim();
                }
            }

            if (currentQuestion) {
                extractedQuestions.push(currentQuestion);
            }

            if (extractedQuestions.length > 0) {
                console.warn("Fallback: Extracted questions using regex:", extractedQuestions);
                return extractedQuestions;
            } else {
                console.warn("Fallback: Could not extract any questions");
                return [];
            }
        }
    } catch (error) {
        console.error("Error in getQuestions:", error);
        return [];
    }
}

// Function to generate feedback
async function getFeedback(questions, userAnswers, subtopic) {
    let prompt = `Provide feedback for the following quiz on the topic '${subtopic}'.  The questions, user answers, and correct answers are given below. Include overall score, a compliment, where the user is good at, and where the user can improve.\n\n`;

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = userAnswers[i];
        const correctAnswer = question.correctAnswer;

        prompt += `Question ${i + 1}: ${question.question}\n`;
        prompt += `Options: ${JSON.stringify(question.options)}\n`;
        prompt += `User's Answer: ${userAnswer ? question.options[userAnswer] : "No Answer"}\n`;  // Show option text
        prompt += `Correct Answer: ${question.options[correctAnswer]}\n\n`; // Show option text
    }

     try{
        const feedbackText = await callGeminiAPI(prompt);
        return feedbackText;
    }
    catch (error) {
        console.error("Error in getFeedback:", error);
        return "Could not generate feedback at this time.";
    }
}

// --- Helper functions to show and hide loading indicator ---
function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// --- Event Listener for index.html (Topic and Grade Selection) ---
document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next-button');

    if (nextButton) { // We're on index.html
        nextButton.addEventListener('click', async function() {
            const topicInput = document.getElementById('topic').value;
            const gradeLevel = document.getElementById('grade-level').value;
            const enteredTopic = topicInput.trim(); // Trim whitespace

            if (enteredTopic) {
                localStorage.setItem('selectedTopic', enteredTopic);
                localStorage.setItem('gradeLevel', gradeLevel);

                showLoadingIndicator(); // Show loading indicator

                try {
                    const subtopics = await getSubtopics(enteredTopic, gradeLevel);
                    if (subtopics.length > 0) {
                        sessionStorage.setItem('subtopics', JSON.stringify(subtopics));
                        window.location.href = 'subtopics.html';
                    } else {
                        alert("Could not generate subtopics for this topic. Please try a different topic or adjust the grade level.");
                    }
                } catch (error) {
                    alert("An error occurred while fetching subtopics.");
                } finally {
                    hideLoadingIndicator(); // Hide loading indicator
                }
            } else {
                alert("Please enter a topic.");
            }
        });
    }
});

// --- Event Listener for subtopics.html ---

document.addEventListener('DOMContentLoaded', function() {
    const subtopicsContainer = document.getElementById('subtopics-container');
    const topicTitle = document.getElementById('topic-title');

    if (subtopicsContainer) { // On subtopics page
        const selectedTopic = localStorage.getItem('selectedTopic');
        if (selectedTopic) {
            topicTitle.textContent = `Subtopics for ${selectedTopic}`;
        }

        const subtopics = JSON.parse(sessionStorage.getItem('subtopics'));
        if (subtopics && subtopics.length > 0) {
            subtopics.forEach(subtopic => {
                const button = document.createElement('button');
                button.textContent = subtopic;
                button.addEventListener('click', function() {
                    localStorage.setItem('selectedSubtopic', subtopic);
                    window.location.href = 'question.html';
                });
                subtopicsContainer.appendChild(button);
            });
        } else {
            subtopicsContainer.textContent = "No subtopics found. Please try a different topic or grade level.";
        }
    }
});

// --- Event Listener for question.html ---

document.addEventListener('DOMContentLoaded', function() {
    const questionsContainer = document.getElementById('questions-container');
    const submitButton = document.getElementById('submit-button');
    const topicTitle = document.getElementById('topic-title');

    if (questionsContainer) { // We're on question.html
        const selectedSubtopic = localStorage.getItem('selectedSubtopic');
        const gradeLevel = localStorage.getItem('gradeLevel');
        if (selectedSubtopic) {
            topicTitle.textContent = `Quiz on ${selectedSubtopic}`;
        }

        if (selectedSubtopic && gradeLevel) {
            // Generate and display questions
            (async () => { // Immediately-invoked async function expression (IIFE)
                showLoadingIndicator();
                try {
                    const questions = await getQuestions(selectedSubtopic, gradeLevel);
                    if (questions && questions.length > 0) {

                        questions.forEach((question, index) => {
                            const questionDiv = document.createElement('div');
                            questionDiv.classList.add('question');

                            const questionText = document.createElement('p');
                            questionText.textContent = `Question ${index + 1}: ${question.question}`;
                            questionDiv.appendChild(questionText);

                            const optionsContainer = document.createElement('div');
                            optionsContainer.classList.add('options-container');

                            // Create radio buttons for each option
                            for (const optionKey in question.options) {
                                const option = question.options[optionKey];

                                const optionDiv = document.createElement('div');
                                optionDiv.classList.add('option');

                                const radioInput = document.createElement('input');
                                radioInput.type = 'radio';
                                radioInput.name = `question-${index}`;
                                radioInput.value = optionKey;
                                radioInput.id = `question-${index}-${optionKey}`;

                                const optionLabel = document.createElement('label');
                                optionLabel.textContent = `${optionKey}: ${option}`;
                                optionLabel.htmlFor = `question-${index}-${optionKey}`;

                                optionDiv.appendChild(radioInput);
                                optionDiv.appendChild(optionLabel);
                                optionsContainer.appendChild(optionDiv);
                            }

                            questionDiv.appendChild(optionsContainer);
                            questionsContainer.appendChild(questionDiv);
                        });

                        submitButton.style.display = 'block'; // Show submit after questions

                        submitButton.addEventListener('click', async function() {
                            const userAnswers = [];
                            for (let i = 0; i < questions.length; i++) {
                                const selectedOption = document.querySelector(`input[name="question-${i}"]:checked`);
                                userAnswers.push(selectedOption ? selectedOption.value : null); // Store null for unanswered
                            }
                            localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

                            // Get feedback from API
                            showLoadingIndicator();
                            try{
                                const feedback = await getFeedback(questions, userAnswers, selectedSubtopic);
                                localStorage.setItem('feedback', feedback);
                                window.location.href = 'feedback.html';
                            } catch(error){
                                alert("An error occurred while fetching feedback.");
                            } finally{
                                hideLoadingIndicator();
                            }
                        });
                    } else {
                        questionsContainer.textContent = 'No questions found for this topic.';
                    }
                } catch (error) {
                    console.error("Error:", error);
                    questionsContainer.textContent = 'An error occurred while fetching questions.';
                } finally {
                    hideLoadingIndicator();
                }
            })(); // Execute the IIFE
        } else {
            topicTitle.textContent = 'No topic selected. Please go back to the topic selection page.';
            submitButton.disabled = true;
        }
    }
});

// --- Event Listener for feedback.html ---
document.addEventListener('DOMContentLoaded', function() {
  const feedbackContainer = document.getElementById('feedback-container');

  if (feedbackContainer) { // We're on feedback.html
      const feedback = localStorage.getItem('feedback');
    if (feedback) {
      feedbackContainer.innerHTML = `<p>${feedback}</p>`;
    } else {
      feedbackContainer.innerHTML = '<p>No feedback available.</p>';
    }
  }
});