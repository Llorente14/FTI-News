//DOM untuk Navbar
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

//DOM untuk Dropdown
const dropdownContent = document.getElementById("dropdownContent");
const dropdownBtn = document.getElementById("dropdownBtn");
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

//Jquery untuk fungsi search-bar
$(document).ready(function () {
  searchInput = $(".search-form .search-input");

  $(".search-form").on("submit", (e) => {
    e.preventDefault();

    searchValue = searchInput.val().trim();

    if (searchValue !== "") {
      console.log(searchValue);
      window.location.href = `/pages/search-page.html?search=${encodeURIComponent(
        searchValue
      )}`;
    } else {
      window.location.href = "/pages/search-page.html";
    }
  });
});
