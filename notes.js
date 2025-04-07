// Function to call the Gemini API for generating content
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyBh99Ip-EIdRsrlovksEYdefaWHyRioSzM'; // Replace with your API key if needed
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
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
  
  // Event listener for the Detailed Notes page
  document.addEventListener('DOMContentLoaded', function () {
    const notesForm = document.getElementById('notes-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const notesOutput = document.getElementById('notes-output');
  
    notesForm.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      // Get user input values
      const subject = document.getElementById('subject').value.trim();
      const topic = document.getElementById('topic').value.trim();
      const academicLevel = document.getElementById('academic-level').value;
  
      if (!subject || !topic || !academicLevel) {
        alert("Please fill out all fields.");
        return;
      }
  
      // Build the prompt for detailed notes
      const prompt = `Generate detailed, well-structured notes for the subject '${subject}' on the topic '${topic}' appropriate for ${academicLevel} level.
      The notes should be organized into clear sections with headings, paragraphs, and formulas if necessary.
      Provide short, concise notes using proper formatting.`;
  
      // Show loading indicator and clear previous output
      loadingIndicator.style.display = 'block';
      notesOutput.innerHTML = '';
  
      try {
        const notesText = await callGeminiAPI(prompt);
        // Replace newline characters with HTML breaks for proper formatting
        notesOutput.innerHTML = notesText.replace(/\n/g, '<br>');
      } catch (error) {
        notesOutput.innerHTML = "An error occurred while generating notes. Please try again.";
      } finally {
        loadingIndicator.style.display = 'none';
      }
    });
  });
  