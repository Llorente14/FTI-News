import { biografiPenerbit } from "./data/biografiPenerbit.js";

$(document).ready(function () {
  const allPenerbit = Object.keys(biografiPenerbit);

  if (allPenerbit.length === 0) {
    console.error("Tidak ada penerbit yang tersedia di biografiPenerbit");
    return;
  }

  console.log("Penerbit yang tersedia:", allPenerbit);

  const penerbitUtama = allPenerbit[0];
  const apiUrl = `https://berita-indo-api.vercel.app/v1/${penerbitUtama}`;

  console.log(
    "Mengambil berita utama dari:",
    biografiPenerbit[penerbitUtama].nama
  );

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long" };
    return date.toLocaleDateString("id-ID", options);
  }

  function truncateText(text, maxLength) {
    if (!text || text.length === 0) return "";
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

      const mainNews = newsData[0];
      $(".main-news .img-container .news-title").text(mainNews.title);
      $(".main-news .img-container img").attr({
        src: mainNews.image.large || mainNews.image.small,
        alt: mainNews.title,
      });
      $(".main-news .img-container a").attr("href", mainNews.link);

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

      console.log("Main news dan sub news berhasil di-render");
    })
    .fail(function (xhr, status, error) {
      console.error("Terjadi kesalahan saat fetch:", error);
      console.error("Status:", status);
      console.error("Response:", xhr.responseText);
    });

  // 3. Render Berita Populer: 4 dari CNN News, sisanya dari penerbit lain
  const $popularCards = $(".populer-news .card");
  const totalPopularCards = $popularCards.length;
  const cnnNewsKey = "cnn-news";
  const otherPenerbit = allPenerbit.filter((key) => key !== cnnNewsKey);

  const cnnPromise = $.get(
    `https://berita-indo-api.vercel.app/v1/${cnnNewsKey}`
  )
    .then(function (res) {
      const cnnNews = res.data || [];
      return cnnNews.slice(0, 4).map(function (news) {
        return {
          news: news,
          penerbitKey: cnnNewsKey,
          penerbitNama: biografiPenerbit[cnnNewsKey].nama,
        };
      });
    })
    .catch(function () {
      return [];
    });

  const otherPromises = otherPenerbit.map(function (penerbitKey) {
    const penerbitApiUrl = `https://berita-indo-api.vercel.app/v1/${penerbitKey}`;
    const penerbitNama = biografiPenerbit[penerbitKey].nama;

    return $.get(penerbitApiUrl)
      .then(function (res) {
        const penerbitNews = res.data || [];
        return penerbitNews.slice(0, 1).map(function (news) {
          return {
            news: news,
            penerbitKey: penerbitKey,
            penerbitNama: penerbitNama,
          };
        });
      })
      .catch(function () {
        return [];
      });
  });

  Promise.all([cnnPromise, ...otherPromises]).then(function (results) {
    const allPopularNews = results.flat();

    allPopularNews.slice(0, totalPopularCards).forEach(function (item, index) {
      const $card = $popularCards.eq(index);
      $card.find("img").attr({
        src: item.news.image.small,
        alt: item.news.title,
      });

      $card
        .find(".card-date")
        .html(
          `<p class="card-date">${formatDate(
            item.news.isoDate
          )} | <span><a href="/pages/profile-penerbit.html?penerbit=${
            item.penerbitKey
          }" class="card-publisher">${item.penerbitNama}</a></span></p>`
        );

      $card
        .find(".card-title a")
        .text(item.news.title)
        .attr("href", item.news.link);

      $card
        .find(".card-description")
        .text(truncateText(item.news.contentSnippet || "", 150));
    });

    console.log(
      `Berita populer berhasil di-render: ${
        allPopularNews.slice(0, totalPopularCards).length
      } berita`
    );
  });

  // 4. Fungsi untuk mengambil berita berdasarkan kategori
  function fetchCategoryNews(category, containerSelector) {
    const $container = $(containerSelector);
    const maxNews = 3;
    const categoryPromises = [];

    allPenerbit.forEach(function (penerbitKey) {
      const categoryUrl = `https://berita-indo-api.vercel.app/v1/${penerbitKey}/${category}`;
      const penerbitNama = biografiPenerbit[penerbitKey].nama;

      const promise = $.get(categoryUrl)
        .then(function (response) {
          const categoryNews = response.data || [];
          if (categoryNews.length === 0) {
            return [];
          }
          return categoryNews.slice(0, 1).map(function (news) {
            return {
              news: news,
              penerbitKey: penerbitKey,
              penerbitNama: penerbitNama,
            };
          });
        })
        .catch(function () {
          return [];
        });

      categoryPromises.push(promise);
    });

    // Menunggu semua proses selesai baru dikirim dengan memakai promise
    Promise.all(categoryPromises).then(function (results) {
      const allCategoryNews = results.flat();

      if (allCategoryNews.length === 0) {
        return;
      }

      allCategoryNews.slice(0, maxNews).forEach(function (item, index) {
        if (index === 0) {
          $container
            .find(".update-card.featured .update-img-container img")
            .attr({
              src: item.news.image.small,
              alt: item.news.title,
            });

          $container
            .find(".update-card.featured .update-title")
            .text(item.news.title);

          $container
            .find(".update-card.featured .update-description")
            .html(`${truncateText(item.news.contentSnippet || "", 100)} `);

          if (!$container.find(".update-card.featured").parent().is("a")) {
            $container
              .find(".update-card.featured")
              .wrap(
                `<a href="${item.news.link}" target="_blank" style="text-decoration: none; color: inherit;"></a>`
              );
          }
        } else {
          const $regularCards = $container.find(".update-card:not(.featured)");
          const cardIndex = index - 1;

          if (cardIndex < $regularCards.length) {
            const $card = $regularCards.eq(cardIndex);
            $card.find(".update-title").html(`${item.news.title} `);

            if (!$card.parent().is("a")) {
              $card.wrap(
                `<a href="${item.news.link}" target="_blank" style="text-decoration: none; color: inherit;"></a>`
              );
            }
          }
        }
      });
    });
  }

  // 5. Render Update News untuk setiap kategori
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

  const displayCategories = categories.slice(0, 8);

  displayCategories.forEach(function (category, index) {
    const containerSelector = `.update-news .update-category:nth-child(${
      index + 1
    })`;

    const formattedCategory = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    $(`${containerSelector} .category-header h2`).text(formattedCategory);

    fetchCategoryNews(category, containerSelector);
  });
});
