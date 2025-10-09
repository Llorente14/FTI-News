let currentRotation = 0;
const carousel = document.getElementById("carousel");
const cards = document.querySelectorAll(".carousel-card");
const totalItems = cards.length;
const anglePerItem = 360 / totalItems;

function updateVisibility() {
  if (window.innerWidth > 900) {
    cards.forEach((card, index) => {
      // Menghitung nilai angle
      const position = parseInt(card.style.getPropertyValue("--position"));
      const initialAngle = position * anglePerItem;

      // Hitung current angle dengan rotasi
      const currentAngle = (initialAngle + currentRotation) % 360;
      const normalizedAngle =
        currentAngle < 0 ? currentAngle + 360 : currentAngle;

      // Menyembunyikan card terdepan yaitu yang diatas 269 derajat dan dibawah 91 derajat
      if (normalizedAngle > 270 || normalizedAngle < 90) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
      } else {
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
      }
    });
  }
}

function rotateCarousel(direction) {
  currentRotation += direction * anglePerItem;
  carousel.style.transform = `translate(-50%, -30%) perspective(1200px) rotateX(-8deg) rotateY(${currentRotation}deg)`;
  updateVisibility();
}

document.querySelector(".prev").addEventListener("click", () => {
  if (window.innerWidth > 900) {
    rotateCarousel(1);
  }
});

document.querySelector(".next").addEventListener("click", () => {
  if (window.innerWidth > 900) {
    rotateCarousel(-1);
  }
});

// Initialize visibility
updateVisibility();