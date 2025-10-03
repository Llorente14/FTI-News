const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        const userData = { email, rememberMe, loginTime: new Date().toISOString() };

        if (rememberMe) {
            localStorage.setItem("userData", JSON.stringify(userData));
            sessionStorage.removeItem("userData");
        } else {
            sessionStorage.setItem("userData", JSON.stringify(userData));
            localStorage.removeItem("userData");
        }

        showMessage(`Welcome back, ${email}!`, 'success');
        loginForm.reset();
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        setTimeout(() => {
            window.location.href = "/index.html"; // redirect ke home
        }, 800);
    }, 1200);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}