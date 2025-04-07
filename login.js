// 🌙 Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;

themeToggle.addEventListener("click", () => {
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    themeToggle.innerHTML = newTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// 🔙 Back Button
document.querySelector(".back-button").addEventListener("click", () => {
    window.history.back();
});

// 📝 Accept Any Login & Redirect to Home Page
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing

    // Get input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    // ✅ Accept any login and redirect to home2.html
    alert("Login Successful! Redirecting...");
    window.location.href = "home2.html";
});
