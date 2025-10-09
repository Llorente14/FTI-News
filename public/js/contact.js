// Script for Contact Form Submission
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("success-message");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent actual form submission

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Create message object
      const messageData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
      };

      // Get existing messages from local storage or initialize an empty array
      let messages =
        JSON.parse(localStorage.getItem("contactMessages")) || [];

      // Add the new message
      messages.push(messageData);

      // Save the updated messages array to local storage
      localStorage.setItem("contactMessages", JSON.stringify(messages));

      // Show success message
      if (successMessage) {
        successMessage.style.display = "block";
      }

      // Reset the form after showing the message
      contactForm.reset();

      // Hide the message after 5 seconds
      setTimeout(() => {
        if (successMessage) {
          successMessage.style.display = "none";
        }
      }, 5000);
    });
  }
});
