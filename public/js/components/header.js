document.addEventListener("DOMContentLoaded", () => {
  // Ambil data user dari localStorage atau sessionStorage
  let userData = null;
  try {
    userData =
      JSON.parse(localStorage.getItem("userData")) ||
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

  dropdownBtn.addEventListener("click", toggleDropdown);

  //Jquery untuk fungsi search-bar
  $(document).ready(function () {
    searchInput = $(".search-form .search-input");

    $(".search-form").on("submit", (e) => {
      e.preventDefault();

      searchValue = searchInput.val().trim();

      if (searchValue !== "") {
        console.log(searchValue);
        window.location.href = `/pages/search.html?search=${encodeURIComponent(
          searchValue
        )}`;
      } else {
        window.location.href = "/pages/search.html";
      }
    });
  });

  if (dropdownBtn && dropdownContent) {
    dropdownBtn.addEventListener("click", toggleDropdown);
  }

  /* Login / Logout Navbar*/
  const authLi = document.getElementById("auth-link");

  if (authLi) {
    if (userData && (userData.name || userData.email)) {
      // ✅ Sekarang selalu tampilkan nama user
      const displayName = userData.name || userData.email.split("@")[0];
      authLi.innerHTML = `
        Halo, ${displayName} | <a href="#" id="logout-btn">Logout</a>
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
      authLi.innerHTML = `<a href="/pages/login.html">Login</a>`;
    }
  }

  /* Set Link Kategori */
  document.querySelectorAll(".dropdown-menu a").forEach((a) => {
    const label = a.textContent.trim().toLowerCase().replace(/\s+/g, "-");
    a.href = `/pages/category.html?kategori=${encodeURIComponent(label)}`;
    a.classList.add("kategori");
    a.setAttribute("data-cat", label);
  });
});
