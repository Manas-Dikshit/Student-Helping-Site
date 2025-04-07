let interval;
let time = 0;
let isRunning = false;
let isPinned = false;
let selectedAudio = null;
let audioElement = new Audio();

const timeDisplay = document.getElementById("time");
const popup = document.getElementById("popup");
const popupTime = document.getElementById("popupTime");
const progressCircle = document.querySelector('.progress');

// Create audio selector dynamically
const audioSelector = document.createElement("select");
audioSelector.id = "audioSelector";
audioSelector.innerHTML = `
    <option value="" selected disabled>Select Relaxation Audio</option>
    <option value="rain.mp3">Soft Rain</option>
    <option value="audio2.mp3">Ocean Waves</option>
    <option value="audio3.mp3">Forest Birds</option>
`;
document.querySelector(".container").appendChild(audioSelector);

// Format time function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
}

// Start Timer Function
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        playSelectedAudio();
        interval = setInterval(() => {
            time--;
            if (time < 0) {
                clearInterval(interval);
                isRunning = false;
                time = 0;
                stopAudio();
            }
            updateTimerDisplay();
        }, 1000);
    }
}

// Start Preset Timer Function
function startPreset(minutes) {
    time = minutes * 60;
    updateTimerDisplay();
    startTimer();
    localStorage.setItem("pomodoroTime", time);
    localStorage.setItem("isRunning", isRunning);
    localStorage.setItem("popupVisible", "true");
}

// Pause Timer Function
function pauseTimer() {
    isRunning = false;
    clearInterval(interval);
    pauseAudio();
    localStorage.setItem("isRunning", isRunning);
}

// Reset Timer Function
function resetTimer() {
    isRunning = false;
    clearInterval(interval);
    time = 0;
    updateTimerDisplay();
    stopAudio();
    localStorage.removeItem("pomodoroTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("popupVisible");
}

// Update Timer Display Function
function updateTimerDisplay() {
    const formattedTime = formatTime(time);
    timeDisplay.textContent = formattedTime;
    popupTime.textContent = formattedTime;

    const dashOffset = 628.3 - (time % 300) * (628.3 / 300);
    progressCircle.style.strokeDashoffset = dashOffset;
}

// Audio Handling Functions
function playSelectedAudio() {
    selectedAudio = audioSelector.value;
    if (selectedAudio) {
        audioElement.src = selectedAudio;
        audioElement.loop = true;
        audioElement.play();
    }
}

function pauseAudio() {
    if (audioElement) {
        audioElement.pause();
    }
}

function stopAudio() {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
}

// Toggle Popup Function
function togglePopup() {
    popup.style.display = (popup.style.display === "none" || popup.style.display === "") ? "block" : "none";
    localStorage.setItem("popupVisible", popup.style.display === "block" ? "true" : "false");
}

// Toggle Pin Function
function togglePin() {
    if (!isPinned) {
        popup.style.position = "fixed";
        popup.style.top = "10px";
        popup.style.left = "10px";
        popup.style.zIndex = "9999";
        isPinned = true;
    } else {
        popup.style.position = "absolute";
        popup.style.top = "80px";
        popup.style.left = "80px";
        isPinned = false;
    }
}

// Popup Drag Functionality
let offsetX, offsetY, isDragging = false;

popup.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        popup.style.left = `${e.clientX - offsetX}px`;
        popup.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Restore Pomodoro State on Page Reload
window.addEventListener("load", () => {
    const savedTime = localStorage.getItem("pomodoroTime");
    const savedRunning = localStorage.getItem("isRunning");
    const popupVisible = localStorage.getItem("popupVisible");

    if (savedTime) {
        time = parseInt(savedTime, 10);
        updateTimerDisplay();
    }

    if (savedRunning === "true") {
        startTimer();
    }

    if (popupVisible === "true") {
        popup.style.display = "block";
    }
});

// Remove timer data if user leaves the site
window.addEventListener("beforeunload", () => {
    localStorage.removeItem("pomodoroTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("popupVisible");
});
