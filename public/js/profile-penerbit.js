import { biografiPenerbit } from "../js/data/biografiPenerbit.js";
import {
  generateBeritaId,
  isBookmarked,
  initBookmarkButton,
} from "../js/ultilitas/ultility.js";

$(document).ready(function () {
  // Fungsi untuk mendapatkan parameter dari URL
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Ambil parameter penerbit dari URL
  var penerbit = getUrlParameter("penerbit");

  if (!penerbit) {
    $("#judul-penerbit").text("Penerbit tidak ditemukan");
    $("#data-profil").html("<p>Silakan pilih penerbit dari halaman utama.</p>");
    return;
  }

  // Konversi nama penerbit ke format yang sesuai (lowercase, spasi jadi -)
  var penerbitSlug = penerbit.toLowerCase().replace(/\s+/g, "-");

  // Set judul penerbit
  var infoPenerbit = biografiPenerbit[penerbitSlug];
  if (infoPenerbit) {
    $("#judul-penerbit").text(infoPenerbit.nama);

    // Tampilkan logo penerbit
    $(".img-container").html(
      '<img src="' +
        infoPenerbit.logo +
        '" alt="Logo ' +
        infoPenerbit.nama +
        '" class="logo-penerbit">'
    );

    // Tampilkan biografi
    $("#data-profil").html("<p>" + infoPenerbit.biografi + "</p>");
  } else {
    $("#judul-penerbit").text(penerbit);
  }

  // Ambil data artikel dari API
  var apiUrl = "https://berita-indo-api.vercel.app/v1/" + penerbitSlug;

  $.get(apiUrl)
    .done(function (response) {
      if (response && response.data && response.data.length > 0) {
        // Limit hanya 10 artikel
        var artikelTerbatas = response.data.slice(0, 10);

        // Bersihkan container
        $("#artikel-container").empty();

        // Loop untuk setiap artikel
        artikelTerbatas.forEach(function (artikel) {
          // Data untuk bookmark
          const itemData = {
            berita: artikel,
            slugPenerbit: penerbitSlug,
            namaPenerbit: infoPenerbit ? infoPenerbit.nama : penerbit,
          };

          // Cek status bookmark
          const beritaId = generateBeritaId(artikel);
          const bookmarked = isBookmarked(beritaId);
          const iconClass = bookmarked ? "bxs-bookmark" : "bx-bookmark";
          const buttonClass = bookmarked ? "bookmarked" : "";

          var artikelCard = `
           <div class="news-card">
            <div class="news-image">
            <img 
                src="${
                  artikel.image.small || "/public/images/skeleton-news.png"
                }" 
                alt="${artikel.title}"
                onerror="this.src='/public/images/skeleton-news.png'"
            >
            </div>
            <div class="news-content">
            <h3 class="news-title">${artikel.title}</h3>
            <p class="news-snippet">${
              artikel.contentSnippet || "Tidak ada deskripsi."
            }</p>
            <div class="card-actions">
                 <a href="${
                   artikel.link
                 }" target="_blank" class="news-link">Baca Selengkapnya</a>
           
                <button class="bookmark-btn ${buttonClass}">
                  <i class="bx ${iconClass}"></i>
                </button>
                 </div>
            </div>
         </div>
          `;

          // Append card ke container
          const $artikelCard = $(artikelCard);
          $("#artikel-container").append($artikelCard);

          // Initialize bookmark button untuk card ini
          const $bookmarkBtn = $artikelCard.find(".bookmark-btn");
          initBookmarkButton($bookmarkBtn, itemData);
        });
      } else {
        $("#artikel-container").html(
          "<p>Tidak ada artikel yang tersedia saat ini.</p>"
        );
      }
    })
    .fail(function (error) {
      console.error("Error fetching data:", error);
      $("#artikel-container").html(
        "<p>Gagal memuat artikel. Silakan coba lagi nanti.</p>"
      );
    });
});
