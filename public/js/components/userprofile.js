const maleAvatarPath = "/public/images/man-user-circle-icon.png";
const femaleAvatarPath = "/public/images/woman-user-circle-icon.png";

document.addEventListener("DOMContentLoaded", () => {
  let activeUserData = null;
  let allUsers = [];

  // Fungsi untuk menampilkan pesan
  function showMessage(elementId, message, isSuccess = false) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.className = `message ${isSuccess ? "success" : "error"}`;
      messageElement.style.display = message ? "block" : "none";
    }
  }

  // Fungsi untuk memuat data pengguna
  function loadData() {
    const storedAllUsers = localStorage.getItem("registeredUsers");
    if (storedAllUsers) {
      allUsers = JSON.parse(storedAllUsers);
    }

    const activeUserSession =
      localStorage.getItem("userData") || sessionStorage.getItem("userData");

    if (activeUserSession) {
      try {
        const sessionData = JSON.parse(activeUserSession);
        const fullUserData = allUsers.find(
          (user) => user.email.toLowerCase() === sessionData.email.toLowerCase()
        );

        if (fullUserData) {
          activeUserData = fullUserData;
          displayUserData(activeUserData);
        } else {
          console.error("Data pengguna tidak ditemukan di registeredUsers");
          showMessage(
            "editProfileMsg",
            "Data pengguna tidak ditemukan.",
            false
          );
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.error(
        "Tidak ada pengguna yang aktif. Mengarahkan ke halaman login."
      );
      window.location.href = "login.html";
    }
  }

  // Fungsi untuk menampilkan data pengguna
  function displayUserData(userData) {
    if (!userData) return;

    document.getElementById("profileName").textContent = userData.name;
    document.getElementById("profileEmail").textContent = userData.email;
    document.getElementById("detailName").textContent = userData.name;
    document.getElementById("detailEmail").textContent = userData.email;
    document.getElementById("detailPhone").textContent =
      userData.phone || "Belum diatur";
    document.getElementById("detailGender").textContent = userData.gender
      ? userData.gender === "male"
        ? "Laki-laki"
        : "Perempuan"
      : "Belum diatur";
    document.getElementById("detailBio").textContent =
      userData.bio || "Belum diatur";

    // Update avatar berdasarkan gender
    if (userData.gender === "male") {
      document.getElementById("profileAvatar").src = maleAvatarPath;
    } else if (userData.gender === "female") {
      document.getElementById("profileAvatar").src = femaleAvatarPath;
    } else {
      document.getElementById("profileAvatar").src =
        "https://via.placeholder.com/150";
    }
  }

  // Fungsi untuk validasi form
  function validateForm(newName, newPassword, confirmPassword, newBio) {
    // Validasi nama
    if (newName && (newName.length < 3 || newName.length > 32)) {
      showMessage("editProfileMsg", "Nama harus antara 3-32 karakter.", false);
      return false;
    }

    if (newName && /\d/.test(newName)) {
      showMessage(
        "editProfileMsg",
        "Nama tidak boleh mengandung angka.",
        false
      );
      return false;
    }

    // Validasi password jika diisi
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        showMessage(
          "editProfileMsg",
          "Password harus minimal 8 karakter.",
          false
        );
        return false;
      }

      if (newPassword !== confirmPassword) {
        showMessage(
          "editProfileMsg",
          "Password baru dan konfirmasi password tidak cocok.",
          false
        );
        return false;
      }
    }

    // Validasi bio
    if (newBio && (newBio.length < 3 || newBio.length > 100)) {
      showMessage("editProfileMsg", "Bio harus antara 3-100 karakter.", false);
      return false;
    }

    return true;
  }

  // Fungsi untuk menangani update profil
  function handleProfileUpdate(event) {
    event.preventDefault();

    const newName = document.getElementById("newName").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const newBio = document.getElementById("newBio").value.trim();
    const selectedGender = document.querySelector(
      'input[name="gender"]:checked'
    );
    const newGender = selectedGender ? selectedGender.value : null;

    // Validasi form
    if (!validateForm(newName, newPassword, confirmPassword, newBio)) {
      return;
    }

    if (!activeUserData) {
      return showMessage(
        "editProfileMsg",
        "Gagal menyimpan, user tidak ditemukan.",
        false
      );
    }

    // Update data di registeredUsers
    const userIndex = allUsers.findIndex(
      (user) => user.email.toLowerCase() === activeUserData.email.toLowerCase()
    );

    if (userIndex !== -1) {
      // Update data user
      if (newName) allUsers[userIndex].name = newName;
      if (newBio) allUsers[userIndex].bio = newBio;
      if (newGender) allUsers[userIndex].gender = newGender;
      if (newPassword) allUsers[userIndex].password = newPassword; // Dalam aplikasi nyata, password harus di-hash

      // Simpan ke localStorage
      localStorage.setItem("registeredUsers", JSON.stringify(allUsers));

      // Update activeUserData
      activeUserData = allUsers[userIndex];
    } else {
      return showMessage(
        "editProfileMsg",
        "User tidak ditemukan dalam database.",
        false
      );
    }

    // Update session data
    const sessionDataString =
      localStorage.getItem("userData") || sessionStorage.getItem("userData");
    if (sessionDataString) {
      try {
        let sessionData = JSON.parse(sessionDataString);
        if (newName) sessionData.name = newName;

        if (localStorage.getItem("userData")) {
          localStorage.setItem("userData", JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem("userData", JSON.stringify(sessionData));
        }
      } catch (error) {
        console.error("Error updating session data:", error);
      }
    }

    showMessage("editProfileMsg", "Profil berhasil diperbarui!", true);

    setTimeout(() => {
      const modal = document.getElementById("editProfileModal");
      const profileForm = document.getElementById("updateProfileForm");

      if (modal) modal.style.display = "none";
      if (profileForm) profileForm.reset();

      showMessage("editProfileMsg", "");
      loadData(); // Reload data untuk menampilkan perubahan
    }, 1500);
  }

  // Fungsi untuk inisialisasi modal
  function initializeModal() {
    const modal = document.getElementById("editProfileModal");
    const editBtn = document.getElementById("editProfileBtn");
    const closeBtn = document.getElementById("closeModalBtn");
    const profileForm = document.getElementById("updateProfileForm");

    if (editBtn) {
      editBtn.onclick = () => {
        if (activeUserData) {
          document.getElementById("newName").value = activeUserData.name || "";
          document.getElementById("newBio").value = activeUserData.bio || "";

          // Set gender radio button
          if (activeUserData.gender) {
            document.getElementById(activeUserData.gender).checked = true;
          }
        }
        if (modal) modal.style.display = "flex";
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        if (modal) modal.style.display = "none";
        showMessage("editProfileMsg", "");
      };
    }

    if (profileForm) {
      profileForm.addEventListener("submit", handleProfileUpdate);
    }

    // Close modal ketika klik di luar
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        showMessage("editProfileMsg", "");
      }
    };
  }

  // Fungsi untuk inisialisasi tabs
  function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Remove active class from all buttons and sections
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.remove("active");
        });

        // Add active class to clicked button and target section
        button.classList.add("active");
        if (targetTab) {
          const targetSection = document.getElementById(targetTab);
          if (targetSection) targetSection.classList.add("active");
        }
      });
    });
  }

  // Fungsi untuk inisialisasi logout
  function initializeLogout() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
        alert("Anda berhasil logout.");
        window.location.href = "login.html";
      });
    }
  }

  // Inisialisasi semua fungsi
  loadData();
  initializeModal();
  initializeTabs();
  initializeLogout();
});
