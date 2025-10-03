$(document).ready(function () {
    let allNewsData = []; // Variabel untuk menyimpan semua data berita
    const newsContainer = $(".search-results");

    // --- Helper Functions ---
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
    }

    function truncateText(text, maxLength) {
        if (!text) return "";
        if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
        }
        return text;
    }

    // --- Fungsi untuk memfilter dan menampilkan hasil ---
    function renderResults(query) {
        newsContainer.empty(); // Kosongkan hasil sebelumnya

        // Jika query kosong, jangan tampilkan apa-apa
        if (!query) {
            $('.search-title').text("Silakan Masukkan Kata Kunci");
            return;
        }

        $('.search-title').text(`Hasil Pencarian untuk "${query}"`);

        // Filter array allNewsData berdasarkan judul
        const filteredNews = allNewsData.filter(function (news) {
        // Ubah judul berita dan query ke huruf kecil agar pencarian tidak case-sensitive
        const title = news.title.toLowerCase();
        const searchQuery = query.toLowerCase();
        return title.includes(searchQuery);
        });

        if (filteredNews.length > 0) {
        // Jika ada hasil yang cocok, tampilkan
        filteredNews.forEach(function (news) {
            const newsCardHTML = `
                <a href="${news.link}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                <article class="news-card">
                    <div class="card-image">
                        <img src="${news.image.small}" alt="${news.title}">
                    </div>
                    <div class="card-content">
                        <p class="source">CNN News</p>
                        <h2>${news.title}</h2>
                        <p class="snippet">${truncateText(news.contentSnippet, 100)}</p>
                        <p class="timestamp">${formatDate(news.isoDate)}</p>
                    </div>
                </article>
                </a>
            `;
            newsContainer.append(newsCardHTML);
        });
        } else {
        // Jika tidak ada hasil setelah filter
        newsContainer.html(`<p style="text-align: center;">Tidak ada hasil ditemukan untuk "${query}".</p>`);
        }
    }

    // --- Alur Utama ---

    // 1. Ambil SEMUA berita dari CNN saat halaman dimuat
    newsContainer.html(`<p style="text-align: center;">Mempersiapkan data berita...</p>`);
    $.get("https://berita-indo-api.vercel.app/v1/cnn-news")
        .done(function (response) {
        // 2. Simpan data ke variabel allNewsData
        allNewsData = response.data || [];
        
        // 3. Ambil query dari URL dan jalankan fungsi renderResults pertama kali
        const urlParams = new URLSearchParams(window.location.search);
        const initialQuery = urlParams.get('q');
        if (initialQuery) {
            $('.search-bar input').val(initialQuery);
            renderResults(initialQuery); // Tampilkan hasil awal
        } else {
            newsContainer.empty();
            $('.search-title').text("Silakan Masukkan Kata Kunci");
        }

        })
        .fail(function () {
        newsContainer.html('<p style="text-align: center;">Gagal memuat data awal dari API. Coba refresh halaman.</p>');
        });

    // 4. Siapkan event listener untuk pencarian berikutnya (TANPA memanggil API lagi)
    $('.search-bar').on('submit', function(event) {
        event.preventDefault();
        const newQuery = $('.search-bar input').val();
        renderResults(newQuery); // Langsung filter data yang sudah ada
    });
});