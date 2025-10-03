document.addEventListener("DOMContentLoaded", () => {
    // Ambil data user dari localStorage atau sessionStorage
    let userData = null;
    try {
        userData = JSON.parse(localStorage.getItem("userData")) ||
            JSON.parse(sessionStorage.getItem("userData"));
    } catch (e) {
        userData = null;
    }

    /* Toggle Navbar Mobile*/
    const navbarToggle = document.querySelector(".navbar-toggle");
    const navbarMenu = document.querySelector(".navbar-menu");

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener("click", () => {
            navbarToggle.classList.toggle("active");
            navbarMenu.classList.toggle("active");
        });
    }

    /* Dropdown Kategori*/
    const dropdownBtn = document.getElementById("dropdownBtn");
    const dropdownContent = document.getElementById("dropdownContent");
    let dropdownOpen = false;

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
        dropdownContent.classList.toggle("open", dropdownOpen);
        dropdownBtn.classList.toggle("active", dropdownOpen);
    }

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener("click", toggleDropdown);
    }

    /* Login / Logout Navbar*/
    const authLi = document.getElementById("auth-link");

    if (authLi) {
        if (userData && userData.email) {
            // Jika sudah login
            authLi.innerHTML = `
        Halo, ${userData.email} | <a href="#" id="logout-btn">Logout</a>
      `;
            const logoutBtn = document.getElementById("logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("userData");
                    sessionStorage.removeItem("userData");
                    window.location.reload();
                });
            }
        } else {
            // Jika belum login
            authLi.innerHTML = `<a href="/login/login.html">Login</a>`;
        }
    }

    /* Set Link Kategori */
    document.querySelectorAll(".dropdown-menu a").forEach((a) => {
        const label = a.textContent.trim().toLowerCase();
        a.href = `/kategori/kategori.html?cat=${encodeURIComponent(label)}`;
        a.classList.add("kategori");
        a.setAttribute("data-cat", label);
    });
});