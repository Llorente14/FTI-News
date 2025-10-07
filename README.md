Proyek Website News (UTS Pemrograman Frontend)
Proyek "Website News" adalah tugas Ujian Tengah Semester (UTS) untuk mata kuliah Pemrograman Frontend yang dikembangkan oleh Kelompok 1. Proyek ini bertujuan untuk membangun sebuah portal berita digital yang modern, interaktif, dan responsif dengan fungsionalitas penuh di sisi klien (client-side).

👥 Anggota Tim (Kelompok 1)
535240143 - Axel Chrisdy Sanjaya (Llorente14)

535240176 - Tandwiyan Talenta (tndwyntlnt)

535240187 - Naisya Yuen Ra'af (itsyuenai)

535240090 - Delvyn Putra (del22-afk)

535240070 - Christy Jones (christyjns)

535240183 - Affan Moshe (affanmoshe)

🛠️ Teknologi yang Digunakan

HTML: Membangun struktur konten dan artikel berita.

CSS: Mendesain layout dan memastikan tampilan responsif.

JavaScript (Vanilla): Menangani logika inti dan pengambilan data berita dari API.

jQuery: Membantu menyederhanakan interaksi DOM, seperti menampilkan dan memfilter berita.

🏛️ Arsitektur Proyek & Struktur Folder

Struktur proyek ini dirancang dengan pendekatan modular dan berbasis komponen.  
Tujuannya adalah untuk memastikan bahwa setiap bagian dari kode memiliki tempat yang jelas, mudah ditemukan, dan dapat dikelola secara independen.  
Hal ini sangat penting untuk mendukung kolaborasi tim dan skalabilitas proyek di masa depan.

📂 Peta Direktori

```sh
.
├── 📄 index.html               # Halaman utama aplikasi
├── 📁 pages/                   # Berisi semua halaman sekunder
│   └── 📄 splashscreen.html
└── 📁 public/                  # Semua aset statis (CSS, JS, Gambar)
    ├── 📁 css/
    │   ├── 📁 components/      # Styling untuk komponen spesifik (header, footer)
    │   ├── 📁 variables/       # Variabel global (warna, font)
    │   └── 📄 homepage.css     # Styling khusus untuk halaman utama
    ├── 📁 images/
    └── 📁 js/
        ├── 📁 components/      # Logika JS untuk komponen spesifik
        └── 📜 app.js           # File JavaScript utama (entry point)
```

🌐 Sumber API Berita
Seluruh konten berita yang ditampilkan dalam website ini diambil secara dinamis dari API publik yang disediakan oleh DAFTAR-API-LOKAL-INDONESIA.

✨ Fitur Utama
Halaman Beranda Dinamis: Menampilkan berita utama, berita terbaru, dan berita populer yang diambil langsung dari [API](https://berita-indo-api.vercel.app/v1/cnn-news)

Halaman Kategori & Pencarian: Memfilter dan mencari berita berdasarkan kategori atau kata kunci.

Halaman Detail Artikel: Menampilkan isi lengkap berita, penulis, dan tanggal publikasi.

Sistem Akun (Simulasi): Fungsionalitas login, registrasi, dan profil pengguna disimulasikan menggunakan JavaScript dan Local Storage untuk menyimpan data sesi dan bookmark.

Bookmark Artikel: Pengguna dapat menyimpan artikel favorit mereka, yang akan tersimpan di browser.

Desain Responsif: Tampilan yang dapat beradaptasi dengan baik di berbagai ukuran layar, mulai dari desktop hingga perangkat mobile.

🚀 Cara Menjalankan Proyek
Proyek ini perlu dijalankan menggunakan server lokal untuk menghindari masalah CORS saat mengambil data dari API. Cara termudah adalah menggunakan ekstensi Live Server di Visual Studio Code.

Clone Repository Ini:

git clone https://github.com/Llorente14/FTI-News

Buka Folder Proyek di VS Code.

Jalankan dengan Live Server:

Klik kanan pada file index.html.

Pilih opsi "Open with Live Server".

Proyek akan otomatis terbuka di browser Anda dan siap digunakan.


