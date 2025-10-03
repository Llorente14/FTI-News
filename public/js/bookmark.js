// Tunggu sampai seluruh konten halaman siap
document.addEventListener('DOMContentLoaded', () => {
    // Ganti dengan URL API berita Anda yang sebenarnya
    const apiUrl = 'https://berita-indo-api.vercel.app/v1/cnn-news'; // <-- Ganti dengan URL API Anda

    // Panggil fungsi untuk mengambil dan menampilkan berita
    ambilBerita(apiUrl);
});

/**
 * Fungsi untuk mengambil data dari API dan menampilkannya di halaman.
 * Menggunakan async/await untuk kode yang lebih bersih.
 */
async function ambilBerita(url) {
    const containerBerita = document.getElementById('news-container'); // Pastikan Anda punya div dengan id ini di HTML
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Kosongkan container sebelum mengisi dengan berita baru
        containerBerita.innerHTML = '';

        // Loop setiap artikel dari hasil API dan buat HTML-nya
        data.articles.forEach(artikel => {
            // Cek jika ada artikel yang tidak punya gambar, bisa diskip atau pakai gambar default
            if (!artikel.urlToImage) return;

            // Buat elemen div untuk setiap artikel
            const artikelDiv = document.createElement('div');
            artikelDiv.className = 'artikel'; // Beri class untuk styling

            // Isi div dengan HTML yang berisi data dari API
            artikelDiv.innerHTML = `
                <img src="${artikel.urlToImage}" alt="${artikel.title}" class="gambar-artikel">
                <h3>${artikel.title}</h3>
                <p>${artikel.description || 'Tidak ada deskripsi.'}</p>
                
                <button class="tombol-bookmark" 
                        data-id="${artikel.url}" 
                        data-judul="${artikel.title}"
                        data-gambar="${artikel.urlToImage}">
                    🔖 Bookmark
                </button>
            `;
            
            // Tambahkan div artikel ke container utama
            containerBerita.appendChild(artikelDiv);
        });
        
        // Setelah SEMUA berita ditampilkan, barulah kita pasang event listener
        pasangEventListenerBookmark();

    } catch (error) {
        console.error("Gagal mengambil berita:", error);
        containerBerita.innerHTML = "<p>Maaf, gagal memuat berita saat ini.</p>";
    }
}

/**
 * Fungsi untuk memasang event listener ke semua tombol bookmark yang ada di halaman.
 */
function pasangEventListenerBookmark() {
    const semuaTombolBookmark = document.querySelectorAll('.tombol-bookmark');
    
    semuaTombolBookmark.forEach(tombol => {
        tombol.addEventListener('click', () => {
            const beritaBaru = {
                id: tombol.dataset.id,         // Ambil data dari atribut
                title: tombol.dataset.judul,
                imageUrl: tombol.dataset.gambar
            };
            simpanKeLocalStorage(beritaBaru);
        });
    });
}

/**
 * Fungsi untuk menyimpan objek berita ke Local Storage.
 * (Fungsi ini sama persis seperti sebelumnya)
 */
function simpanKeLocalStorage(berita) {
    const bookmarksJSON = localStorage.getItem('bookmarks');
    let bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : [];

    const sudahAda = bookmarks.some(b => b.id === berita.id);
    if (sudahAda) {
        alert('Berita ini sudah ada di bookmark Anda!');
        return;
    }

    bookmarks.push(berita);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Berita berhasil ditambahkan ke bookmark!');
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Ambil elemen-elemen yang diperlukan
    const newsContainer = document.getElementById('newsContainer');
    const newsItems = document.querySelectorAll('.news-item');
    
    // Elemen di dalam kolom berita utama yang akan diisi
    const featuredImage = document.querySelector('.featured-news img');
    const featuredTitle = document.querySelector('.featured-news h2');

    // Lakukan perulangan untuk setiap item berita
    newsItems.forEach(item => {
        // Tambahkan event listener 'click' pada setiap item
        item.addEventListener('click', function() {
            // Ambil data dari item yang di-klik
            const clickedImageSrc = item.querySelector('img').src;
            const clickedTitleText = item.querySelector('p').textContent;

            // Masukkan data tersebut ke dalam kolom berita utama
            featuredImage.src = clickedImageSrc;
            featuredTitle.textContent = clickedTitleText;
            
            // Tampilkan kolom berita utama dengan menambahkan kelas 'show-featured'
            newsContainer.classList.add('show-featured');
        });
    });

});