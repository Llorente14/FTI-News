$(document).ready(function() {
    //Berguna untuk melimit berita yang ditampilkan dalam satu page
    const ITEMS_PER_PAGE = 9;
    let currentPage = 1;
    //Ini berguna untuk menyimpna data hasil hit ke API yang nantinya akan digunakan
    //Untuk membagi per bagian index arraynya
    let allNewsData = [];

    //Memanggil elemen yang akan dipakai
    const newsContainer = $("#news-container");
    const loadingIndicator = $("#loading");
    const categoryTitle = $("#category-title");
    const paginationContainer = $("#pagination-container");

    function renderNewsPage(page) {
        currentPage = page;
        newsContainer.empty();

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        //Berarti jika startnya 0 dan perpage ada 9 halaman, berarti endindexnnya 9
        const endIndex = startIndex + ITEMS_PER_PAGE;
        //Berarti line ini berguna untuk mengambil data yang sudah disimpan dari start index skrg yaitu 0 dan endnya = 9 artinya index dengan 0-8 data terambil
        const newsForPage = allNewsData.slice(startIndex, endIndex);

        newsForPage.forEach(function(berita) {
            // Format tanggal
            let formattedDate = '';
            if (berita.isoDate) {
                const date = new Date(berita.isoDate);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                formattedDate = date.toLocaleDateString('id-ID', options);
            }

            const newsCard = `
        <div class="news-card">
          <div class="news-image">
            <img src="${berita.image.small}" alt="${berita.title}">
          </div>
          <div class="news-content">
            <div class="news-meta">
              <span class="news-date">${formattedDate}</span>
              <span class="news-separator">|</span>
              <a href="/pages/profile-penerbit.html?penerbit=cnn-news" class="news-source">CNN News</a>
            </div>
            <h3 class="news-title">${berita.title}</h3>
            <p class="news-snippet">${berita.contentSnippet}</p>
            <a href="${berita.link}" target="_blank" class="news-link">Baca Selengkapnya</a>
          </div>
        </div>
      `;
            newsContainer.append(newsCard);
        });

        renderPaginationControls();
    }

    function renderPaginationControls() {
        paginationContainer.empty();

        /*Rumus untuk mendapat total halaman paginationnya dengan cara,
         totalSemuaData yang sudah disimpan dibagi dengan banyak items 
         yang ingin ditampilkan dalam satu halaman */
        const totalPages = Math.ceil(allNewsData.length / ITEMS_PER_PAGE);

        if (totalPages > 1) {
            const prevButton = `<button class="pagination-btn" id="prev-page" ${
        currentPage === 1 ? "disabled" : ""
      }>Previous</button>`;
            paginationContainer.append(prevButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = `<button class="pagination-btn page-number ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>`;
                paginationContainer.append(pageButton);
            }

            const nextButton = `<button class="pagination-btn" id="next-page" ${
        currentPage === totalPages ? "disabled" : ""
      }>Next</button>`;
            paginationContainer.append(nextButton);
        }
    }

    //Mengambil search parameter dari url
    //misal: http://127.0.0.1:5500/pages/category.html?kategori=nasional
    //Berarti dengan location.search dia akan mencari mulai ari tanda ?
    const urlParams = new URLSearchParams(window.location.search);
    //Lalu kita ambil yang nama atributnya atau keynya kategori
    const category = urlParams.get("kategori");

    if (category) {
        const formattedTitle = category
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        categoryTitle.text(`Berita Kategori: ${formattedTitle}`);
        loadingIndicator.show();

        const apiUrl = `https://berita-indo-api.vercel.app/v1/cnn-news/${category}`;

        $.get(apiUrl)
            .done(function(response) {
                loadingIndicator.hide();
                allNewsData = response.data || [];

                if (allNewsData.length > 0) {
                    renderNewsPage(1);
                } else {
                    //Kegunaan .html seperti innerHTML
                    newsContainer.html(
                        '<p class="no-news">Tidak ada berita yang ditemukan untuk kategori ini.</p>'
                    );
                }
            })
            .fail(function() {
                loadingIndicator.hide();
                newsContainer.html(
                    '<p class="error-message">Gagal memuat berita. Silakan coba lagi.</p>'
                );
            });
    } else {
        categoryTitle.text("Kategori Tidak Ditemukan");
        newsContainer.html(
            '<p class="error-message">Silakan pilih kategori dari halaman utama.</p>'
        );
    }

    paginationContainer.on("click", ".page-number", function() {
        const page = parseInt($(this).data("page"));
        renderNewsPage(page);
    });

    paginationContainer.on("click", "#prev-page", function() {
        if (currentPage > 1) {
            renderNewsPage(currentPage - 1);
        }
    });

    paginationContainer.on("click", "#next-page", function() {
        const totalPages = Math.ceil(allNewsData.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            renderNewsPage(currentPage + 1);
        }
    });
});