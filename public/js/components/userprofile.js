function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick').includes(sectionId)) {
            button.classList.add('active');
        }
    });
}

const modal = document.getElementById('editProfileModal');
const editBtn = document.getElementById('editProfileBtn');
const closeBtn = document.getElementById('closeModalBtn');

editBtn.onclick = function () {
    modal.style.display = 'flex';
};

closeBtn.onclick = function () {
    modal.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function showMessage(elementId, message, isSuccess = false) {
    const msgElement = document.getElementById(elementId);
    msgElement.textContent = message;
    msgElement.style.color = isSuccess ? '#16A34A' : '#DC2626';
    return false;
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const newName = document.getElementById('newName').value.trim();
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (!newName && !newPass && !confirmPass) {
        return showMessage('editProfileMsg', "Tidak ada perubahan untuk disimpan.");
    }

    if (newName) {
        if (newName.length < 3 || newName.length > 32 || /\d/.test(newName)) {
            return showMessage('editProfileMsg', "Nama tidak valid (3-32 karakter, tanpa angka).");
        }
    }

    if (newPass) {
        if (newPass.length < 8) {
            return showMessage('editProfileMsg', "Kata sandi baru minimal 8 karakter.");
        }
        if (newPass !== confirmPass) {
            return showMessage('editProfileMsg', "Konfirmasi kata sandi baru tidak cocok.");
        }
    } else if (confirmPass && !newPass) {
        return showMessage('editProfileMsg', "Isi kolom kata sandi baru terlebih dahulu.");
    }

    showMessage('editProfileMsg', "Profil berhasil diperbarui!", true);

    if (newName) {
        document.getElementById('profileName').textContent = newName;
        document.getElementById('detailName').textContent = newName;
    }

    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('updateProfileForm').reset();
        showMessage('editProfileMsg', '');
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('myProfile');
});

document.getElementById('logoutButton').addEventListener('click', function (event) {
    event.preventDefault();

    alert('Anda berhasil logout.');
    window.location.href = 'login.html'; //     
});