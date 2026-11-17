// Interactive smooth scrolling and navigation highlights
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");

    // Close mobile menu or track active links on scroll
    window.addEventListener("scroll", () => {
        let fromTop = window.scrollY + 120;

        navLinks.forEach(link => {
            const section = document.querySelector(link.hash);
            if (section) {
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    link.style.color = "var(--accent)";
                } else if (!link.classList.contains("contact-pill")) {
                    link.style.color = "";
                }
            }
        });
    });
});
