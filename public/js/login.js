// Konstanta untuk key di localStorage
const USER_DB_KEY = 'registeredUsers';
const SESSION_KEY = 'userData';
const RESET_TOKEN_KEY = 'resetTokens';

const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
let registeredUsers = [];

// Load registered users dari localStorage
function loadUsers() {
    const stored = localStorage.getItem(USER_DB_KEY);
    if (stored) {
        try {
            registeredUsers = JSON.parse(stored);
        } catch (e) {
            console.error("Gagal memuat data pengguna dari localStorage:", e);
            registeredUsers = [];
        }
    }
}

// Save users ke localStorage
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
    setTimeout(() => { messageDiv.style.display = 'none'; }, 4000);
}

// Validasi kredensial user
function validateUser(email, password) {
    return registeredUsers.find(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate token untuk reset password
function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36);
}

// Simpan reset token
function saveResetToken(email, token) {
    const tokens = JSON.parse(localStorage.getItem(RESET_TOKEN_KEY) || '{}');
    tokens[email.toLowerCase()] = {
        token: token,
        expiry: Date.now() + (15 * 60 * 1000) // 15 menit
    };
    localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(tokens));
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

// Event listener untuk form login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validasi input
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

    // Validasi apakah user terdaftar dan password benar
    const user = validateUser(email, password);

    if (!user) {
        showMessage('Invalid email or password. Please try again.', 'error');
        return;
    }

    // Login berhasil
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        const userData = {
            name: user.name || email.split('@')[0],
            email: user.email,
            loginTime: new Date().toISOString()
        };

        // Simpan sesi pengguna
        if (rememberMe) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
            sessionStorage.removeItem(SESSION_KEY);
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
            localStorage.removeItem(SESSION_KEY);
        }

        showMessage(`Welcome back, ${userData.name}!`, 'success');

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 500);

    }, 800);
});

// Handler untuk forgot password dengan modal
function handleForgotPassword() {
    // Buat modal untuk input email
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <div class="reset-modal-content">
            <span class="reset-close">&times;</span>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a reset link.</p>
            <form id="resetForm">
                <div class="form-group">
                    <label for="resetEmail">Email Address</label>
                    <input type="email" id="resetEmail" placeholder="Enter your email" required>
                </div>
                <button type="submit" class="reset-btn">Send Reset Link</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal
    const closeBtn = modal.querySelector('.reset-close');
    closeBtn.onclick = () => modal.remove();

    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    // Handle reset form submission
    const resetForm = modal.querySelector('#resetForm');
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('resetEmail').value.trim();

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            alert('Email not found in our system');
            return;
        }

        // Generate token dan simpan
        const token = generateResetToken();
        saveResetToken(email, token);

        // Simulasi kirim email - dalam real app, ini dikirim ke email user
        const resetLink = `${window.location.origin}${window.location.pathname.replace('login.html', '')}reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;

        console.log('=== RESET PASSWORD LINK ===');
        console.log('Email:', email);
        console.log('Reset Link:', resetLink);
        console.log('Token expires in 15 minutes');
        console.log('===========================');

        modal.remove();

        // Tampilkan link ke user (dalam real app, ini dikirim via email)
        showResetLinkModal(resetLink);
    });
}

// Tampilkan reset link ke user (simulasi email)
function showResetLinkModal(resetLink) {
    const modal = document.createElement('div');
    modal.className = 'reset-modal';
    modal.innerHTML = `
        <div class="reset-modal-content">
            <span class="reset-close">&times;</span>
            <h2>Reset Link Generated</h2>
            <p style="color: #22c55e; margin-bottom: 15px;">✓ Reset password link has been generated!</p>
            <p style="font-size: 14px; margin-bottom: 15px;">In a real application, this would be sent to your email. For demo purposes, click the button below:</p>
            <button onclick="window.location.href='${resetLink}'" class="reset-btn">Go to Reset Password Page</button>
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; word-break: break-all; font-size: 12px; font-family: monospace;">
                ${resetLink}
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 15px;">Link expires in 15 minutes</p>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.reset-close');
    closeBtn.onclick = () => modal.remove();

    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Check if on reset password page
function checkResetPasswordPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (token && email) {
        // Validate token
        if (!validateResetToken(email, token)) {
            showMessage('Invalid or expired reset link. Please request a new one.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
            return;
        }

        // Show reset password form
        showResetPasswordForm(email, token);
    }
}

// Show reset password form
function showResetPasswordForm(email, token) {
    const container = document.querySelector('.login-container');
    container.innerHTML = `
        <div class="login-header">
            <h1>Reset Password</h1>
            <p>Enter your new password</p>
        </div>
        
        <div id="message" class="message"></div>
        
        <form id="newPasswordForm">
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" placeholder="Enter new password" required minlength="6">
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password" required minlength="6">
            </div>
            
            <button type="submit" class="login-btn">Reset Password</button>
        </form>
        
        <div class="register-link">
            Remember your password? <a href="login.html">Back to Login</a>
        </div>
    `;

    const newPasswordForm = document.getElementById('newPasswordForm');
    newPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        if (newPassword.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        // Update password
        if (updateUserPassword(email, newPassword)) {
            clearResetToken(email);
            showMessage('Password successfully reset! Redirecting to login...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('Failed to reset password. Please try again.', 'error');
        }
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();

    // Check if this is a reset password page
    checkResetPasswordPage();

    // Setup forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
});