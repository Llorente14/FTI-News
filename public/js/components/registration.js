document.addEventListener('DOMContentLoaded', () => {
    let registeredUsers = [];

    // --- FUNGSI-FUNGSI UTAMA ---

    function showMessage(message, isSuccess = false) {
        const msgElement = document.getElementById('registMsg');

        if (!msgElement) return;

        msgElement.className = 'message';
        msgElement.textContent = message;

        if (isSuccess) {
            msgElement.classList.add('success');
        } else {
            msgElement.classList.add('error');
        }
    }

    function loadUsers() {
        const stored = localStorage.getItem('registeredUsers');
        if (stored) {
            try {
                registeredUsers = JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing users:', e);
                registeredUsers = [];
            }
        }
    }

    function saveUsers() {
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        return true;
    }

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

        // Validasi
        if (!name || !email || !pass || !phone || !confirmPass) {
            return showMessage("Semua kolom wajib diisi.");
        }
        if (name.length < 3 || name.length > 32 || /\d/.test(name)) {
            return showMessage("Nama lengkap tidak valid (3-32 karakter, tanpa angka).");
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return showMessage("Format email tidak valid.");
        }
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
            name, email, phone, password: pass,
            registeredAt: new Date().toISOString()
        };
        registeredUsers.push(newUser);

        if (saveUsers()) {
            showMessage("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.", true);
            document.getElementById('registForm').reset();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
        }
    }

    // --- INISIALISASI & PENGHUBUNGAN EVENT ---

    // 1. Muat data user yang ada
    loadUsers();

    // 2. Hubungkan form ke fungsi handleRegistration
    const registForm = document.getElementById('registForm');
    if (registForm) {
        console.log('Registration form found, attaching event listener.');
        registForm.addEventListener('submit', () => {
            handleRegistration(event);
            console.log('ssssss')
        });
    }
});