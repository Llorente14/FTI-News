// Simulasi database user (dalam aplikasi real, ini ada di backend)
let registeredUsers = [];

function showMessage(message, isSuccess = false) {
    const msgElement = document.getElementById('registMsg');
    msgElement.textContent = message;
    msgElement.className = 'message';

    if (message) {
        msgElement.classList.add(isSuccess ? 'success' : 'error');
    }
}

// Load registered users saat halaman dimuat
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

// Simpan users ke storage
function saveUsers() {
    try {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    } catch (e) {
        console.error('Gagal menyimpan data:', e);
    }
}

// Cek apakah email sudah terdaftar
function isEmailRegistered(email) {
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('registName').value.trim();
    const email = document.getElementById('registEmail').value.trim();
    const phone = document.getElementById('registPhone').value.trim();
    const pass = document.getElementById('registPassword').value;
    const confirmPass = document.getElementById('registConfirm').value;

    if (!name || !email || !pass || !phone || !confirmPass) {
        return showMessage("Semua kolom wajib diisi.");
    }

    if (name.length < 3 || name.length > 32 || /\d/.test(name)) {
        return showMessage("Nama lengkap tidak valid (3-32 karakter, tanpa angka).");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return showMessage("Format email tidak valid.");
    }

    // Cek apakah email sudah terdaftar
    if (isEmailRegistered(email)) {
        return showMessage("Email sudah terdaftar. Silakan gunakan email lain atau login.");
    }

    if (!/^08\d{8,14}$/.test(phone)) {
        return showMessage("Format nomor HP tidak valid (diawali 08, total 10-16 digit angka).");
    }

    if (pass.length < 8) {
        return showMessage("Kata sandi minimal 8 karakter.");
    }

    if (pass !== confirmPass) {
        return showMessage("Konfirmasi kata sandi tidak cocok.");
    }

    // Simpan user baru
    const newUser = {
        name: name,
        email: email,
        phone: phone,
        password: pass, // NOTE: Dalam aplikasi real, password harus di-hash!
        registeredAt: new Date().toISOString()
    };

    registeredUsers.push(newUser);
    saveUsers();

    showMessage("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.", true);
    document.getElementById('registForm').reset();

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Load users saat halaman dimuat
loadUsers();