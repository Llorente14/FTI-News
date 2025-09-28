function showMessage(message, isSuccess = false) {
    const msgElement = document.getElementById('registMsg');
    msgElement.textContent = message;
    msgElement.className = 'message';

    if (message) {
        msgElement.classList.add(isSuccess ? 'success' : 'error');
    }
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

    if (!/^08\d{8,14}$/.test(phone)) {
        return showMessage("Format nomor HP tidak valid (diawali 08, total 10-16 digit angka).");
    }

    if (pass.length < 8) {
        return showMessage("Kata sandi minimal 8 karakter.");
    }

    if (pass !== confirmPass) {
        return showMessage("Konfirmasi kata sandi tidak cocok.");
    }

    showMessage("Pendaftaran berhasil! Anda akan diarahkan ke halaman login.", true);
    document.getElementById('registForm').reset();

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}