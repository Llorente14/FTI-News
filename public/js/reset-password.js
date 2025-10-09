// Konstanta
const USER_DB_KEY = 'registeredUsers';
const RESET_TOKEN_KEY = 'resetTokens';

const messageDiv = document.getElementById('message');
const resetPasswordForm = document.getElementById('resetPasswordForm');

let registeredUsers = [];
let currentEmail = null;
let currentToken = null;

// Load users dari localStorage
function loadUsers() {
    const stored = localStorage.getItem(USER_DB_KEY);
    if (stored) {
        try {
            registeredUsers = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal memuat data pengguna:", e);
            registeredUsers = [];
        }
    }
}

// Save users
function saveUsers() {
    try {
        localStorage.setItem(USER_DB_KEY, JSON.stringify(registeredUsers));
        return true;
    } catch (e) {
        console.error("Gagal menyimpan data pengguna:", e);
        return false;
    }
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// Validasi reset token
function validateResetToken(email, token) {
    const tokens = JSON.parse(localStorage.getItem(RESET_TOKEN_KEY) || '{}');
    const stored = tokens[email.toLowerCase()];

    if (!stored) return false;
    if (Date.now() > stored.expiry) {
        // Token expired
        delete tokens[email.toLowerCase()];
        localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(tokens));
        return false;
    }
    return stored.token === token;
}

// Update password user
function updateUserPassword(email, newPassword) {
    const userIndex = registeredUsers.findIndex(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) return false;

    registeredUsers[userIndex].password = newPassword;
    return saveUsers();
}

// Clear reset token setelah digunakan
function clearResetToken(email) {
    const tokens = JSON.parse(localStorage.getItem(RESET_TOKEN_KEY) || '{}');
    delete tokens[email.toLowerCase()];
    localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(tokens));
}

// Handle form submission
resetPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validasi password
    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    // Disable button
    const submitBtn = resetPasswordForm.querySelector('.login-btn');
    submitBtn.textContent = 'Resetting...';
    submitBtn.disabled = true;

    // Update password
    setTimeout(() => {
        if (updateUserPassword(currentEmail, newPassword)) {
            clearResetToken(currentEmail);
            showMessage('✓ Password successfully reset! Redirecting to login...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('Failed to reset password. Please try again.', 'error');
            submitBtn.textContent = 'Reset Password';
            submitBtn.disabled = false;
        }
    }, 800);
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();

    // Get token and email from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentToken = urlParams.get('token');
    currentEmail = urlParams.get('email');

    // Validasi token
    if (!currentToken || !currentEmail) {
        showMessage('Invalid reset link. Redirecting to login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    if (!validateResetToken(currentEmail, currentToken)) {
        showMessage('Invalid or expired reset link. Please request a new one.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        return;
    }

    // Token valid, tampilkan email
    document.querySelector('.login-header p').textContent = `Resetting password for ${currentEmail}`;
});