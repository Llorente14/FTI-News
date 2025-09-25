window.addEventListener("DOMContentLoaded", (event) => {
  const splashScreen = document.getElementById("splash-screen");

  // Memberi jeda 2,5 detik sebelum elemen splashscreen di hide
  setTimeout(() => {
    splashScreen.classList.add("hiding");
  }, 2500);

  //Sesudah itu dalam 3 detik, halaman otomatis pindah ke index.html
  setTimeout(() => {
    window.location.href = "index.html"; // <-- INI PERUBAHANNYA
  }, 3000);
});
