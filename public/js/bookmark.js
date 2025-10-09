import { getBookmarks, initBookmarkButton, setDetailBerita, requireAuth } from './ultilitas/ultility.js';

document.addEventListener('DOMContentLoaded', function() {
    requireAuth(); // Pastikan pengguna sudah login
    const newsContainer = document.getElementById('newsContainer');
    const featuredNewsContainer = document.querySelector('.featured-news');
    const featuredImage = featuredNewsContainer.querySelector('img');
    const featuredTitle = featuredNewsContainer.querySelector('h2');
    const featuredSnippet = featuredNewsContainer.querySelector('.featured-snippet');
    const featuredLink = featuredNewsContainer.querySelector('a');
    const newsListContainer = document.getElementById('newsList');

    // Panggil fungsi untuk memuat dan menampilkan bookmark
    loadAndDisplayBookmarks();
    function loadAndDisplayBookmarks() {
        const bookmarks = getBookmarks(); // Ambil semua data bookmark

        // Bersihkan daftar berita sebelumnya
        newsListContainer.innerHTML = ''; 
        newsContainer.classList.remove('show-featured'); // Reset tampilan, pastikan kolom utama tersembunyi

        if (bookmarks.length === 0) {
            newsContainer.innerHTML = '<p class="empty-bookmark">Anda belum memiliki bookmark. Tambahkan berita ke bookmark untuk melihatnya di sini.</p>';
            return;
        }

        // Buat daftar untuk semua bookmark
        bookmarks.forEach((item) => { 
            const newsItemElement = createNewsItem(item);
            newsListContainer.appendChild(newsItemElement);
        });
    }

    /**
     * Menampilkan berita utama (featured) dan memastikan layout terlihat.
     * @param {object} item - Data bookmark yang akan ditampilkan.
     */
    function displayFeaturedNews(item) {
        if (!item) return;

        const berita = item.berita;
        featuredImage.src = berita.image.small || '/public/images/no-image.jpg';
        featuredImage.alt = berita.title;
        featuredTitle.textContent = berita.title;

        if (berita) {
            
            const snippetText = berita.contentSnippet.substring(0, 300) + '...';
            featuredSnippet.textContent = snippetText;
            featuredSnippet.style.display = 'block'; // Pastikan elemennya terlihat
        } else {
            featuredSnippet.style.display = 'none'; // Sembunyikan jika tidak ada konten
        }

        featuredLink.onclick = (e) => {
            e.preventDefault();
            setDetailBerita(berita, item.slugPenerbit, item.namaPenerbit);
        };

        // Tambahkan kelas untuk menampilkan kolom berita utama
        newsContainer.classList.add('show-featured');
    }

    /**
     * Membuat satu elemen item berita untuk daftar di sebelah kanan.
     * @param {object} item - Data bookmark.
     * @returns {HTMLElement} Elemen div .news-item.
     */

    function createNewsItem(item) {
        const berita = item.berita;
        const newsItemDiv = document.createElement('div');
        newsItemDiv.className = 'news-item';

        // 1. Buat Gambar
        const img = document.createElement('img');
        img.src = berita.image.small || '/public/images/no-image.jpg';
        img.alt = berita.title;
        img.onerror = function() { this.src='/public/images/no-image.jpg'; };

        // 2. Buat container untuk teks (judul dan snippet)
        const textContainer = document.createElement('div');
        textContainer.className = 'news-text-content';

        // 3. Buat elemen Judul
        const title = document.createElement('p');
        title.className = 'news-title'; // Tambahkan class spesifik untuk judul
        title.textContent = berita.title;

        // 4. Buat elemen Snippet
        const snippet = document.createElement('p');
        snippet.className = 'news-snippet';
        // Ambil contentSnippet dari data, jika tidak ada, tampilkan string kosong
        snippet.textContent = berita.contentSnippet || ''; 

        // Masukkan judul dan snippet ke dalam textContainer
        textContainer.appendChild(title);
        textContainer.appendChild(snippet);
        
        // 5. Buat Tombol Bookmark
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.innerHTML = `<i class='bx bxs-bookmark'></i>`;

        // Gabungkan semua elemen ke dalam newsItemDiv
        newsItemDiv.appendChild(img);
        newsItemDiv.appendChild(textContainer);
        newsItemDiv.appendChild(bookmarkBtn);

        // Event listener untuk klik (tidak berubah)
        newsItemDiv.addEventListener('click', function(e) {
            if (e.target.closest('.bookmark-btn')) return;
            displayFeaturedNews(item);
            document.querySelectorAll('.news-item').forEach(el => el.classList.remove('active-news'));
            this.classList.add('active-news');
        });
        
        // Inisialisasi tombol bookmark (tidak berubah)
        initBookmarkButton($(bookmarkBtn), item);

        bookmarkBtn.addEventListener('click', () => {
            setTimeout(() => {
                loadAndDisplayBookmarks();
            }, 100);
        });

        return newsItemDiv;
    }
});