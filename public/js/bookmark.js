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