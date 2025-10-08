const maleAvatarPath = 'public/images/man-user-circle-icon.png';
const femaleAvatarPath = 'public/images/woman-user-circle-icon.png';

document.addEventListener('DOMContentLoaded', () => {
    function loadUserData() {
        const activeUserEmail = localStorage.getItem('activeUser');

        if (!activeUserEmail) {
            console.error('Tidak ada pengguna yang aktif. Silakan login terlebih dahulu.');
            return;
        }

        const userDataString = localStorage.getItem(activeUserEmail);

        if (userDataString) {
            const userData = JSON.parse(userDataString);

            document.getElementById('profileName').textContent = userData.name;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('detailName').textContent = userData.name;
            document.getElementById('detailEmail').textContent = userData.email;
            document.getElementById('detailPhone').textContent = userData.phone || 'Belum diatur';
            document.getElementById('detailGender').textContent = userData.gender ? (userData.gender === 'male' ? 'Laki-laki' : 'Perempuan') : 'Belum diatur';
            document.getElementById('detailBio').textContent = userData.bio || 'Belum diatur';

            if (userData.gender === 'male') {
                document.getElementById('profileAvatar').src = maleAvatarPath;
            } else if (userData.gender === 'female') {
                document.getElementById('profileAvatar').src = femaleAvatarPath;
            } else {
                document.getElementById('profileAvatar').src = 'https://via.placeholder.com/150';
            }
        }
    }

    loadUserData();

    const tabs = document.querySelectorAll('.tab-button[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    const modal = document.getElementById('editProfileModal');
    const editBtn = document.getElementById('editProfileBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const profileForm = document.getElementById('updateProfileForm');

    if (editBtn) {
        editBtn.onclick = () => modal.style.display = 'flex';
    }
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    function showMessage(elementId, message, isSuccess = false) {
        const msgElement = document.getElementById(elementId);
        if (!msgElement) return;
        msgElement.textContent = message;
        msgElement.classList.remove('success', 'error');
        if (message) {
            msgElement.classList.add(isSuccess ? 'success' : 'error');
        }
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const newName = document.getElementById('newName').value.trim();
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const newGender = selectedGender ? selectedGender.value : null;

        if (!newName && !newPass && !confirmPass && !newGender) {
            return showMessage('editProfileMsg', "Tidak ada perubahan untuk disimpan.", false);
        }

        const activeUserEmail = localStorage.getItem('activeUser');
        if (activeUserEmail) {
            const userDataString = localStorage.getItem(activeUserEmail);
            let userData = JSON.parse(userDataString);

            if (newName) userData.name = newName;
            if (newGender) userData.gender = newGender;
            if (newPass) userData.password = newPass;

            localStorage.setItem(activeUserEmail, JSON.stringify(userData));

            showMessage('editProfileMsg', "Profil berhasil diperbarui!", true);

            setTimeout(() => {
                modal.style.display = 'none';
                profileForm.reset();
                showMessage('editProfileMsg', '');
                loadUserData();
            }, 1500);

        } else {
            showMessage('editProfileMsg', "Gagal menyimpan, user tidak ditemukan.", false);
        }
    }

    // --- FUNGSI LOGOUT ---
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            const activeUserEmail = localStorage.getItem('activeUser');
            if (activeUserEmail) {
                localStorage.removeItem(activeUserEmail);
            }
            localStorage.removeItem('activeUser');

            alert('Anda berhasil logout.');
            window.location.href = 'login.html';
        });
    }
});