const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
let registeredUsers = [];

// Load registered users dari localStorage
function loadUsers() {
    const stored = localStorage.getItem('registeredUsers');
    if (stored) {
        try {
            registeredUsers = JSON.parse(stored);
        } catch (e) {
            registeredUsers = [];
        }
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

// Event listener untuk form login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validasi input kosong
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Validasi format email
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Validasi panjang password
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    // Validasi apakah user terdaftar dan password benar
    const user = validateUser(email, password);

    if (!user) {
        showMessage('Email atau password salah. Silakan coba lagi atau daftar terlebih dahulu.', 'error');
        return;
    }

    // Proses login
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    setTimeout(() => {
        const userData = {
            name: user.name,
            email: email,
            rememberMe: rememberMe,
            loginTime: new Date().toISOString()
        };

        // Simpan session berdasarkan remember me
        if (rememberMe) {
            localStorage.setItem("userData", JSON.stringify(userData));
            sessionStorage.removeItem("userData");
        } else {
            sessionStorage.setItem("userData", JSON.stringify(userData));
            localStorage.removeItem("userData");
        }

        showMessage(`Welcome back, ${user.name}!`, 'success');
        loginForm.reset();
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;

        setTimeout(() => {
            window.location.href = "/index.html"; // redirect ke home
        }, 800);
    }, 1200);
});

// Handler untuk forgot password
function handleForgotPassword() {
    const email = prompt('Masukkan email Anda untuk reset password:');

    if (!email) {
        return; // User cancel
    }

    if (!isValidEmail(email)) {
        showMessage('Format email tidak valid', 'error');
        return;
    }

    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        showMessage('Email tidak terdaftar dalam sistem', 'error');
        return;
    }

    // Simulasi pengiriman email reset password
    showMessage('Link reset password telah dikirim ke email Anda!', 'success');

    // Dalam aplikasi real, ini akan mengirim email dengan token reset
    console.log(`Reset password requested for: ${email}`);
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Load data users yang sudah terdaftar
    loadUsers();

    // Setup event listener untuk forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
});