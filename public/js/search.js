import { biografiPenerbit } from "/public/js/data/biografiPenerbit.js";
import {
  generateBeritaId,
  isBookmarked,
  initBookmarkButton,
  setDetailBerita,
} from "../js/ultilitas/ultility.js";

$(document).ready(function () {
  let currentPage = 1;
  const itemsPerPage = 9;
  let allNewsData = [];
  const newsContainer = $(".search-results");
  const paginationContainer = $(".pagination-container");

  // Fungsi format tanggal
  function formatDate(isoDate) {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  }

  // Fungsi pagination
  function renderPagination(totalItems, query) {
    paginationContainer.empty();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;
    const createButton = (text, page) => {
      const btn = $(`<button class="page-btn">${text}</button>`);
      btn.on("click", function () {
        if ($(this).is(".disabled, .active")) return;
        currentPage = page;
        renderResults(query);
        $("html, body").animate(
          { scrollTop: newsContainer.offset().top - 100 },
          "slow"
        );
      });
      return btn;
    };
    const prevButton = createButton("<", currentPage - 1);
    if (currentPage === 1) prevButton.addClass("disabled");
    paginationContainer.append(prevButton);
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (currentPage === 1) endPage = Math.min(totalPages, 3);
    if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = createButton(i, i);
      if (i === currentPage) pageButton.addClass("active");
      paginationContainer.append(pageButton);
    }
    const nextButton = createButton(">", currentPage + 1);
    if (currentPage === totalPages) nextButton.addClass("disabled");
    paginationContainer.append(nextButton);
  }

  // Fungsi Render Utama (Dengan Logika Bookmark)
  function renderResults(query) {
    newsContainer.empty();

    if (!query) {
      $(".search-title").text("Silakan Masukkan Kata Kunci");
      paginationContainer.empty();
      return;
    }

    $(".search-title").text(`Hasil Pencarian untuk "${query}"`);
    const filteredNews = allNewsData.filter(function (news) {
      const title = (news.title || "").toLowerCase();
      return title.includes(query.toLowerCase());
    });

    if (filteredNews.length > 0) {
      filteredNews.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = filteredNews.slice(startIndex, endIndex);

      paginatedItems.forEach(function (news) {
        const publisherKey = news.publisher;
        const publisherInfo = biografiPenerbit[publisherKey];
        const publisherName = publisherInfo
          ? publisherInfo.nama
          : (publisherKey || "").replace("-", " ").toUpperCase();

        const newsCardHTML = `
                    <div class="news-card">
                        <div class="news-image">
                            <img 
                                src="${
                                  news.image.small || "/public/images/sket.jpg"
                                }" 
                                alt="${news.title}"
                                onerror="this.src='/public/images/skeleton-news.png'"
                            >
                        </div>
                        <div class="news-content">
                            <div class="news-info">
                                <span class="news-date">${formatDate(
                                  news.isoDate
                                )}</span>
                                <a href="/pages/profile-penerbit.html?penerbit=${publisherKey}" class="news-publisher">${publisherName}</a>
                            </div>
                            <h3 class="news-title">${news.title}</h3>
                            <p class="news-snippet">${
                              news.contentSnippet || "Tidak ada deskripsi."
                            }</p>
                            <div class="card-actions">
                                <a href="#" class="news-link">Baca Selengkapnya</a>
                                <button class="bookmark-btn">
                                    <i class="bx bx-bookmark"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

        const $card = $(newsCardHTML);
        const dataBerita = {
          berita: news,
          slugPenerbit: publisherKey,
          namaPenerbit: publisherName,
        };
        const $bookmarkBtn = $card.find(".bookmark-btn");
        initBookmarkButton($bookmarkBtn, dataBerita);

        $card.find(".news-link").on("click", function (e) {
          e.preventDefault();
          setDetailBerita(news, publisherKey, publisherName);
        });
        newsContainer.append($card);
      });

      renderPagination(filteredNews.length, query);
    } else {
      newsContainer.html(
        `<p style="text-align: left;">Tidak ada hasil ditemukan untuk "${query}".</p>`
      );
      paginationContainer.empty();
    }
  }

  //PROSES PENGAMBILAN DATA AWAL
  newsContainer.html(
    `<div class="loading-container"><p class="loading-text">Memuat berita<span>.</span><span>.</span><span>.</span></p></div>`
  );
  const sources = Object.keys(biografiPenerbit);
  const apiRequests = sources.map(function (source) {
    const apiUrl = `https://berita-indo-api.vercel.app/v1/${source}`;
    return $.get(apiUrl).catch(() => null);
  });
  $.when
    .apply($, apiRequests)
    .done(function () {
      for (let i = 0; i < arguments.length; i++) {
        let result = arguments[i];
        if (result === null) continue;
        let response = Array.isArray(result) ? result[0] : result;
        const sourceKey = sources[i];
        if (response.data) {
          const newsWithPublisher = response.data.map((post) => {
            post.publisher = sourceKey;
            return post;
          });
          allNewsData = allNewsData.concat(newsWithPublisher);
        }
      }
      const urlParams = new URLSearchParams(window.location.search);
      const initialQuery = urlParams.get("search");
      if (initialQuery) {
        $(".search-bar input").val(initialQuery);
        renderResults(initialQuery);
      } else {
        newsContainer.empty();
        $(".search-title").text("Silakan Masukkan Kata Kunci");
      }
    })
    .fail(function () {
      newsContainer.html(
        '<p style="text-align: center;">Gagal memuat data awal dari API. Coba refresh halaman.</p>'
      );
    });

  // Handler untuk form pencarian (tidak berubah)
  $(".search-bar").on("submit", function (event) {
    event.preventDefault();
    currentPage = 1;
    const newQuery = $(".search-bar input").val();
    renderResults(newQuery);
  });
});
