function sendMessage(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const successBox = document.getElementById("success");
    const submitBtn = document.getElementById("submitBtn");

    if (!name || !email || !message) return;

    // Simulate sending with loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span>`;

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;

        successBox.textContent = `Thank you, ${name}! Your message has been prepared. I'll get back to you shortly.`;
        successBox.className = "alert-box success";

        document.getElementById("contactForm").reset();

        setTimeout(() => {
            successBox.className = "alert-box";
            successBox.textContent = "";
        }, 6000);
    }, 700);
}
