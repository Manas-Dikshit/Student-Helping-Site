document.addEventListener('DOMContentLoaded', function() {
    const roadmapResult = localStorage.getItem('roadmapResult');
    const dreamJob = localStorage.getItem('dreamJob');
    const academicLevel = localStorage.getItem('academicLevel');
    const contextInfoDiv = document.getElementById('context-info');
    const roadmapDiv = document.getElementById('roadmap-structured');
  
    // Display context information
    if (dreamJob && academicLevel) {
      contextInfoDiv.innerHTML = `<p><strong>Dream Job:</strong> ${dreamJob}</p>
                                  <p><strong>Academic Level:</strong> ${academicLevel}</p>`;
    }
  
    // Structure and display the roadmap
    if (roadmapResult) {
      /* 
        We expect the roadmap text to contain markers like "Phase 1:", "Phase 2:" and "Phase 3:".
        This code splits the roadmap text based on these markers and creates separate sections.
      */
      const phases = roadmapResult.split(/(Phase \d+:)/).filter(str => str.trim() !== "");
      let structuredHTML = "";
      for (let i = 0; i < phases.length; i += 2) {
        const heading = phases[i].trim();
        const content = phases[i + 1] ? phases[i + 1].trim() : "";
        structuredHTML += `<div class="phase-section">
                             <h2>${heading}</h2>
                             <p>${content.replace(/\n/g, '<br>')}</p>
                           </div>`;
      }
      roadmapDiv.innerHTML = structuredHTML;
    } else {
      roadmapDiv.textContent = "No roadmap available. Please try generating again.";
    }
  
    // Back button redirects to the input page
    document.getElementById('back-button').addEventListener('click', function() {
      window.location.href = 'roadmap.html';
    });
  });
  