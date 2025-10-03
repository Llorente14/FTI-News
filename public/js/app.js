$(document).ready(function () {
  const apiUrl = "https://berita-indo-api.vercel.app/v1/cnn-news";

  console.log("Mencoba mengambil data dari:", apiUrl);

  // Fungsi untuk membuat format tanggal
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("id-ID", options);
  }

  // Fungsi untuk memotong teks snippet
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  $.get(apiUrl)
    .done(function (response) {
      console.log("Data berhasil diambil:", response);

      const newsData = response.data || [];

      if (newsData.length === 0) {
        console.warn("Tidak ada data berita yang ditemukan");
        return;
      }

      // 1. Render Berita Utama (Main News) - berita pertama
      const mainNews = newsData[0];
      $(".main-news .img-container .news-title").text(mainNews.title);
      $(".main-news .img-container img").attr({
        src: mainNews.image.large || mainNews.image.small,
        alt: mainNews.title,
      });
      $(".main-news .img-container a").attr("href", mainNews.link);

      // 2. Render Sub News (2 berita selanjutnya)
      $(".sub-news .news-card").each(function (index) {
        if (newsData[index + 1]) {
          const news = newsData[index + 1];
          $(this).find(".news-title").text(news.title);
          $(this).find("img").attr({
            src: news.image.small,
            alt: news.title,
          });
          $(this).find("a").attr("href", news.link);
        }
      });

      // 3. Render Berita Populer (6 berita, mulai dari index 3)
      $(".populer-news .card").each(function (index) {
        const newsIndex = index + 3;
        if (newsData[newsIndex]) {
          const news = newsData[newsIndex];
          $(this).find("img").attr({
            src: news.image.small,
            alt: news.title,
          });
          $(this).find(".card-date").text(formatDate(news.isoDate));
          $(this)
            .find(".card-title a")
            .text(news.title)
            .attr("href", news.link);
          $(this)
            .find(".card-description")
            .text(truncateText(news.contentSnippet, 150));
        }
      });

      console.log("Semua berita berhasil di-render");
    })
    .fail(function (xhr, status, error) {
      console.error("Terjadi kesalahan saat fetch:", error);
      console.error("Status:", status);
      console.error("Response:", xhr.responseText);
    });

  // Fungsi untuk mengambil berita berdasarkan kategori
  function fetchCategoryNews(category, containerSelector) {
    const categoryUrl = `${apiUrl}/${category}`;

    $.get(categoryUrl)
      .done(function (response) {
        const categoryNews = response.data || [];

        if (categoryNews.length === 0) return;

        const $container = $(containerSelector);

        // Render berita featured (pertama dengan gambar)
        const featured = categoryNews[0];
        $container
          .find(".update-card.featured .update-img-container img")
          .attr({
            src: featured.image.small,
            alt: featured.title,
          });
        $container
          .find(".update-card.featured .update-title")
          .text(featured.title);
        $container
          .find(".update-card.featured .update-description")
          .text(truncateText(featured.contentSnippet, 150));
        $container
          .find(".update-card.featured")
          .wrap(
            `<a href="${featured.link}" target="_blank" style="text-decoration: none; color: inherit;"></a>`
          );

        // Render 2 berita berikutnya (hanya title)
        $container.find(".update-card:not(.featured)").each(function (index) {
          if (categoryNews[index + 1]) {
            const news = categoryNews[index + 1];
            $(this).find(".update-title").text(news.title);
            $(this).wrap(
              `<a href="${news.link}" target="_blank" style="text-decoration: none; color: inherit;"></a>`
            );
          }
        });
      })
      .fail(function (error) {
        console.error(`Gagal mengambil berita kategori ${category}:`, error);
      });
  }

  // 4. Render Update News untuk setiap kategori
  // Array kategori yang tersedia
  const categories = [
    "nasional",
    "teknologi",
    "olahraga",
    "ekonomi",
    "hiburan",
    "gaya-hidup",
    "internasional",
    "otomotif",
  ];

  // Ambil hanya 4 kategori pertama untuk ditampilkan di halaman utama
  const displayCategories = categories.slice(0, 8);
  console.log(displayCategories);

  // Loop untuk mengambil berita setiap kategori
  displayCategories.forEach(function (category, index) {
    const containerSelector = `.update-news .update-category:nth-child(${
      index + 1
    })`;

    // Update judul kategori
    const formattedCategory = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    $(`${containerSelector} .category-header h2`).text(formattedCategory);

    // Fetch berita untuk kategori ini
    fetchCategoryNews(category, containerSelector);
  });
});
