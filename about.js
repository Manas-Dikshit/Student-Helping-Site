document.addEventListener("DOMContentLoaded", function () {
    // Fade-in effect on scroll
    const fadeElements = document.querySelectorAll(".fade-in");
    function checkFadeIn() {
        fadeElements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            if (position < window.innerHeight - 100) {
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }
        });
    }
    window.addEventListener("scroll", checkFadeIn);
    checkFadeIn();

    // Email button functionality
    document.getElementById("send-email").addEventListener("click", function () {
        window.location.href = "mailto:manasdikshit48@gmail.com?subject=Inquiry&body=Hello, I have a question about your services.";
    });

    // Auto-incrementing counter for stats
    function animateCounter(id, target) {
        let count = 0;
        const speed = 50;
        const increment = Math.ceil(target / 100);
        const counter = document.getElementById(id);

        function updateCounter() {
            if (count < target) {
                count += increment;
                counter.textContent = count;
                setTimeout(updateCounter, speed);
            } else {
                counter.textContent = target;
            }
        }
        updateCounter();
    }
    animateCounter("projects", 1500);

    // Smooth scroll for navigation links
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Responsive Navbar Toggle
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener("click", function () {
            navbarCollapse.classList.toggle("show");
        });
    }
});
