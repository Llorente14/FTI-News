//DOM untuk Navbar
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

//DOM untuk Dropdown
const dropdownContent = document.getElementById("dropdown-content");
const dropdownBtn = document.getElementById("dropdown-btn");
let dropdownOpen = false;

function toggleDropdown() {
  dropdownOpen = !dropdownOpen;

  if (dropdownOpen) {
    dropdownContent.classList.add("open");
    dropdownBtn.classList.add("active");
  } else {
    dropdownContent.classList.remove("open");
    dropdownBtn.classList.remove("active");
  }
}

dropdownBtn.addEventListener("click", toggleDropdown);
