// --- Utility Functions ---
// Function to call the Gemini API (adjust API key and endpoint as needed)
async function callGeminiAPI(prompt) {
    const apiKey = 'AIzaSyBh99Ip-EIdRsrlovksEYdefaWHyRioSzM'; // Replace with your API Key
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
        headers: { 'Content-Type': 'application/json' },
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
      throw error; // Re-throw error to be handled by the caller
    }
  }
  
  // Function to get the career roadmap from the API
  async function getRoadmap(dreamJob, academicLevel) {
    const prompt = `Generate a detailed career roadmap for a person with current academic level "${academicLevel}" who aspires to be a "${dreamJob}". The roadmap should be divided into three phases:
  
  Phase 1: Describe the correct path to achieve the job.
  Phase 2: List and explain the essential skills required for the job.
  Phase 3: Provide a short conclusion about the overall path.
  
  Return the roadmap in a structured format with clear headings for each phase.`;
    try {
      const roadmapText = await callGeminiAPI(prompt);
      return roadmapText;
    } catch (error) {
      console.error("Error in getRoadmap:", error);
      return "Could not generate the roadmap at this time.";
    }
  }
  
  // --- Helper Functions for Loading Indicator ---
  function showLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'block';
  }
  
  function hideLoadingIndicator() {
    document.getElementById('loading-indicator').style.display = 'none';
  }
  
  // --- Form Submission Handler ---
  document.getElementById('roadmap-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    showLoadingIndicator();
    const dreamJob = document.getElementById('dream-job').value.trim();
    const academicLevel = document.getElementById('academic-level').value;
    try {
      const roadmap = await getRoadmap(dreamJob, academicLevel);
      // Save result and context to localStorage
      localStorage.setItem('roadmapResult', roadmap);
      localStorage.setItem('dreamJob', dreamJob);
      localStorage.setItem('academicLevel', academicLevel);
      // Redirect to the result page
      window.location.href = 'roadmap-result.html';
    } catch (error) {
      alert("An error occurred while generating the roadmap.");
    } finally {
      hideLoadingIndicator();
    }
  });
  