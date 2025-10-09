import {
  getBookmarks,
  initBookmarkButton,
  setDetailBerita,
  requireAuth,
} from "./ultilitas/ultility.js";

// ============================================
// LOGIKA UTAMA HALAMAN DETAIL
// ============================================

$(document).ready(function () {
  const newsContent = $("#news-content");
  const loading = $("#loading");
  const errorMessage = $("#error-message");
  const relatedNewsContainer = $("#related-news-container");
  const relatedNewsGrid = $("#related-news-grid");

  function formatDate(isoDate) {
    if (!isoDate || isNaN(new Date(isoDate))) {
      return "Tanggal tidak tersedia";
    }
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(isoDate).toLocaleDateString("id-ID", options) + " WIB";
  }

  function formatCardDate(isoDate) {
    if (!isoDate || isNaN(new Date(isoDate))) {
      return "";
    }
    const options = { day: "numeric", month: "long" };
    return new Date(isoDate).toLocaleDateString("id-ID", options);
  }

  /**
   * Inisialisasi kontrol untuk mengubah ukuran font artikel
   */
  function initFontSizeControls() {
    const $articleContent = $(".article-content");
    const $fontButtons = $(".font-btn");
    const FONT_SIZE_KEY = "newsFontSize";

    function applyFontSize(size) {
      $articleContent.removeClass("font-sm font-md font-lg");
      $articleContent.addClass(`font-${size}`);
      $fontButtons.removeClass("active");
      $(`#font-${size}`).addClass("active");
      localStorage.setItem(FONT_SIZE_KEY, size);
    }

    const savedSize = localStorage.getItem(FONT_SIZE_KEY) || "md";
    applyFontSize(savedSize);

    $fontButtons.on("click", function () {
      const newSize = $(this).attr("id").split("-")[1]; // 'sm', 'md', or 'lg'
      applyFontSize(newSize);
    });
  }

  function displayArticle(article) {
    const contentToShow =
      article.fullContent || `<p>${article.contentSnippet}</p>`;
    const articleHTML = `
            <article class="news-article">
                <div class="article-header">
                    <h1>${article.title}</h1>
                </div>
                <p class="article-meta">
                    <span>${formatDate(article.isoDate || new Date())}</span>
                </p>

                <div class="font-size-controls">
                    <span>Ukuran Teks:</span>
                    <button id="font-sm" class="font-btn">A-</button>
                    <button id="font-md" class="font-btn">A</button>
                    <button id="font-lg" class="font-btn">A+</button>
                    <button class="bookmark-btn main-bookmark-btn" title="Bookmark" style="margin-left:auto;">
                        <i class="bx bx-bookmark"></i>
                    </button>
                </div>

                <img src="${article.image.large}" alt="${
      article.title
    }" class="article-image" onerror="this.src='https://placehold.co/800x450/EEE/31343C?text=Image+Not+Found';">
                <div class="article-content">
                    ${contentToShow}
                    <p><a href="${
                      article.link
                    }" target="_blank">Baca selengkapnya di sumber asli...</a></p>
                </div>
            </article>
        `;
    newsContent.html(articleHTML);

    const $mainBookmarkBtn = $(".main-bookmark-btn");
    const mainArticleData = {
      berita: article,
      slugPenerbit: article.slugPenerbit || "cnn-news",
      namaPenerbit: article.namaPenerbit || "CNN News",
    };
    initBookmarkButton($mainBookmarkBtn, mainArticleData);

    // Inisialisasi kontrol font size setelah artikel dirender
    initFontSizeControls();
  }

  // --- LOGIKA BERITA TERKAIT ---
  const KATEGORI_TERSEDIA = [
    "nasional",
    "teknologi",
    "olahraga",
    "ekonomi",
    "hiburan",
    "gaya-hidup",
    "internasional",
    "otomotif",
  ];

  function buatUrlApi(slugPenerbit, kategori = "") {
    const baseUrl = `https://berita-indo-api.vercel.app/v1/${slugPenerbit}`;
    return kategori ? `${baseUrl}/${kategori}` : baseUrl;
  }

  function fetchAndDisplayRelatedNews(penerbit = "cnn-news") {
    const randomIndex = Math.floor(Math.random() * KATEGORI_TERSEDIA.length);
    const randomCategory = KATEGORI_TERSEDIA[randomIndex];
    const apiUrl = buatUrlApi(penerbit, randomCategory);

    $.get(apiUrl)
      .done(function (response) {
        if (response.data && response.data.length > 0) {
          relatedNewsGrid.empty();
          const newsToShow = response.data.slice(0, 4);
          const publisherName = penerbit
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          newsToShow.forEach(function (berita) {
            const cardDate = formatCardDate(berita.isoDate);
            const dataBerita = {
              berita: berita,
              slugPenerbit: penerbit,
              namaPenerbit: publisherName,
            };

            const newsCardHTML = `
                        <div class="card">
                            <div class="card-image-wrapper">
                                <img src="${berita.image.small}" alt="${berita.title}" onerror="this.src='https://placehold.co/400x225/EEE/31343C?text=Image';">
                            </div>
                            <div class="card-content">
                                <p class="card-date">
                                    ${cardDate} |
                                    <span class="card-publisher">${publisherName}</span>
                                </p>
                                <h2 class="card-title">
                                    <a href="javascript:void(0)" class="detail-link">${berita.title}</a>
                                </h2>
                                <p class="card-description">
                                    ${berita.contentSnippet}
                                </p>
                                <div class="card-actions">
                                    <a href="javascript:void(0)" class="news-link detail-link">Baca Selengkapnya</a>
                                    <button class="bookmark-btn" title="Bookmark">
                                        <i class="bx bx-bookmark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        `;

            const $newsCard = $(newsCardHTML);

            initBookmarkButton($newsCard.find(".bookmark-btn"), dataBerita);

            $newsCard.find(".detail-link").on("click", function (e) {
              e.preventDefault();
              setDetailBerita(berita, penerbit, publisherName);
            });

            relatedNewsGrid.append($newsCard);
          });

          relatedNewsContainer.show();
        }
      })
      .fail(function () {
        console.error(
          "Gagal memuat berita terkait dari kategori:",
          randomCategory
        );
        relatedNewsContainer.hide();
      });
  }

  // --- LOGIKA UTAMA ---
  const articleJSON = localStorage.getItem("DetailBerita");

  if (articleJSON) {
    try {
      const article = JSON.parse(articleJSON);
      displayArticle(article);

      loading.hide();
      newsContent.show();

      fetchAndDisplayRelatedNews(article.slugPenerbit || "cnn-news");
    } catch (e) {
      console.error("Gagal mem-parsing data artikel dari localStorage:", e);
      loading.hide();
      errorMessage
        .text("Gagal menampilkan berita karena data tidak valid.")
        .show();
    }
  } else {
    loading.hide();
    errorMessage
      .text(
        "Tidak ada berita yang dipilih. Silakan kembali ke halaman utama dan pilih sebuah artikel."
      )
      .show();
  }
});
