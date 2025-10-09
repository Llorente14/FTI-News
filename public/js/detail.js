$(document).ready(function () {
    const newsContent = $('#news-content');
    const loading = $('#loading');
    const errorMessage = $('#error-message');
    const relatedNewsGrid = $('#related-news-grid');
    const relatedTopicsContainer = $('#related-topics-container');
    const relatedNewsContainer = $('#related-news-container');

    // Fungsi untuk memformat tanggal
    function formatDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoDate).toLocaleDateString('id-ID', options) + ' WIB';
    }

    // Fungsi untuk menampilkan berita utama
    function displayMainArticle(article) {
        const articleHTML = `
            <article class="news-article">
                <h1>${article.title}</h1>
                <p class="article-meta">
                    <span>${formatDate(article.isoDate)}</span>
                </p>
                <img src="${article.image.large}" alt="${article.title}" class="article-image" onerror="this.src='https://placehold.co/800x450/EEE/31343C?text=Image+Not+Found';">
                <div class="article-content">
                    <p>${article.contentSnippet}</p>
                    <a href="${article.link}" target="_blank">Baca selengkapnya di sumber asli...</a>
                </div>
            </article>
        `;
        newsContent.html(articleHTML);
    }

    // Fungsi untuk menampilkan berita terkait
    function displayRelatedNews(articles) {
        relatedNewsGrid.empty(); // Kosongkan grid
        articles.forEach(article => {
            const cardHTML = `
                <a href="${article.link}" target="_blank" class="related-news-card">
                    <img src="${article.image.small}" class="card-image" alt="${article.title}" onerror="this.src='https://placehold.co/400x225/EEE/31343C?text=Image+Not+Found';">
                    <div class="card-content">
                        <h3 class="card-title">${article.title}</h3>
                    </div>
                </a>
            `;
            relatedNewsGrid.append(cardHTML);
        });
    }

    // Menggunakan endpoint 'terbaru' untuk mendapatkan berita terkini
    const apiUrl = 'https://berita-indo-api.vercel.app/v1/${penerbitKey}/${category}';

    $.get(apiUrl)
        .done(function (response) {
            if (response.success && response.data.length > 0) {
                const mainArticle = response.data[0];
                const relatedArticles = response.data.slice(1, 5); // Ambil 4 berita berikutnya

                displayMainArticle(mainArticle);
                displayRelatedNews(relatedArticles);

                // Tampilkan semua section setelah data dimuat
                loading.hide();
                newsContent.show();
                relatedTopicsContainer.show();
                relatedNewsContainer.show();
            } else {
                // Jika tidak ada berita
                loading.hide();
                errorMessage.text('Tidak ada berita yang ditemukan.').show();
            }
        })
        .fail(function () {
            // Jika terjadi error pada request
            loading.hide();
            errorMessage.show();
        });
});

