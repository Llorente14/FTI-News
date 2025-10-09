import { biografiPenerbit } from "./data/biografiPenerbit.js";
import { setDetailBerita } from "./ultilitas/ultility.js";
import {
  generateBeritaId,
  isBookmarked,
  initBookmarkButton,
} from "./ultilitas/ultility.js";
// ============================================
// KONSTANTA DAN KONFIGURASI
// ============================================
const semuaPenerbit = Object.keys(biografiPenerbit);
const PENERBIT_CNN = "cnn-news";
const JUMLAH_BERITA_CNN = 4;
const JUMLAH_BERITA_PER_PENERBIT = 2;
const MAKSIMAL_BERITA_KATEGORI = 3;
const MAKSIMAL_KARAKTER_DESKRIPSI_POPULER = 150;
const MAKSIMAL_KARAKTER_DESKRIPSI_UPDATE = 100;
const KATEGORI_TERSEDIA = [
  "nasional",
  "teknologi",
  "olahraga",
  "ekonomi",
  "hiburan",
  "gaya-hidup",
  "internasional",
  "otomotif",
];
const MAKSIMAL_KATEGORI_TAMPIL = 8;

$(document).ready(function () {
  // Validasi ketersediaan penerbit
  if (semuaPenerbit.length === 0) {
    console.error("Tidak ada penerbit yang tersedia di biografiPenerbit");
    return;
  }

  console.log("Penerbit yang tersedia:", semuaPenerbit);

  // ============================================
  // SECTION 1: BERITA UTAMA DAN SUB BERITA
  // ============================================

  /**
   * Mengambil dan merender berita utama serta berita tambahan dari penerbit pertama
   */
  function renderBeritaUtama() {
    const penerbitUtama = semuaPenerbit[0];
    const urlApi = buatUrlApi(penerbitUtama);

    console.log(
      "Mengambil berita utama dari:",
      biografiPenerbit[penerbitUtama].nama
    );

    $.get(urlApi)
      .done(function (response) {
        console.log("Data berhasil diambil:", response);

        const dataBerita = response.data || [];

        if (dataBerita.length === 0) {
          console.warn("Tidak ada data berita yang ditemukan");
          return;
        }

        renderBeritaPertama(dataBerita[0], penerbitUtama);
        renderBeritaTambahan(dataBerita, penerbitUtama);

        console.log("Main news dan sub news berhasil di-render");
      })
      .fail(function (xhr, status, error) {
        console.error("Terjadi kesalahan saat fetch:", error);
        console.error("Status:", status);
        console.error("Response:", xhr.responseText);
      });
  }

  /**
   * Render berita pertama ke dalam kontainer berita utama
   * @param {Object} berita - Data berita utama
   * @param {string} penerbitUtama - Kunci penerbit utama
   */
  function renderBeritaPertama(berita, penerbitUtama) {
    $(".main-news .img-container .news-title").text(berita.title);
    $(".main-news .img-container img").attr({
      src: berita.image.large || berita.image.small,
      alt: berita.title,
    });

    // Ganti href dengan onclick event
    $(".main-news .img-container a")
      .attr("href", "javascript:void(0)")
      .on("click", function (e) {
        e.preventDefault();
        setDetailBerita(
          berita,
          penerbitUtama,
          biografiPenerbit[penerbitUtama].nama
        );
      });
  }

  /**
   * Render berita tambahan ke dalam kontainer sub news
   * @param {Array} dataBerita - Array berisi data berita
   * @param {string} penerbitUtama - Kunci penerbit utama
   */
  function renderBeritaTambahan(dataBerita, penerbitUtama) {
    $(".sub-news .news-card").each(function (index) {
      const berita = dataBerita[index + 1];
      if (berita) {
        $(this).find(".news-title").text(berita.title);
        $(this).find("img").attr({
          src: berita.image.small,
          alt: berita.title,
        });

        // Ganti href dengan onclick event
        $(this)
          .find("a")
          .attr("href", "javascript:void(0)")
          .on("click", function (e) {
            e.preventDefault();
            setDetailBerita(
              berita,
              penerbitUtama,
              biografiPenerbit[penerbitUtama].nama
            );
          });
      }
    });
  }

  // ============================================
  // SECTION 2: BERITA POPULER
  // ============================================

  /**
   * Mengambil dan merender berita populer:
   * - 4 berita pertama dari CNN News
   * - Sisanya dari penerbit lain (1 berita per penerbit)
   */
  function renderBeritaPopuler() {
    const $kartuPopuler = $(".populer-news .card");
    const totalKartuPopuler = $kartuPopuler.length;
    const penerbitLain = semuaPenerbit.filter(
      (kunci) => kunci !== PENERBIT_CNN
    );

    const promiseCnn = ambilBeritaCnn();
    const promisePenerbitLain = penerbitLain.map((slugPenerbit) =>
      ambilBeritaPenerbit(slugPenerbit, JUMLAH_BERITA_PER_PENERBIT)
    );

    Promise.all([promiseCnn, ...promisePenerbitLain]).then(function (hasil) {
      const semuaBeritaPopuler = hasil.flat();

      semuaBeritaPopuler
        .slice(0, totalKartuPopuler)
        .forEach(function (item, index) {
          renderKartuPopuler($kartuPopuler.eq(index), item);
        });

      console.log(
        `Berita populer berhasil di-render: ${
          semuaBeritaPopuler.slice(0, totalKartuPopuler).length
        } berita`
      );
    });
  }

  /**
   * Mengambil berita dari CNN News
   * @returns {Promise} Promise yang menghasilkan array berita CNN
   */
  function ambilBeritaCnn() {
    return $.get(buatUrlApi(PENERBIT_CNN))
      .then(function (response) {
        const beritaCnn = response.data || [];
        return beritaCnn.slice(0, JUMLAH_BERITA_CNN).map(function (berita) {
          return {
            berita: berita,
            slugPenerbit: PENERBIT_CNN,
            namaPenerbit: biografiPenerbit[PENERBIT_CNN].nama,
          };
        });
      })
      .catch(function () {
        return [];
      });
  }

  /**
   * Mengambil berita dari penerbit tertentu
   * @param {string} slugPenerbit - Kunci penerbit
   * @param {number} jumlah - Jumlah berita yang diambil
   * @returns {Promise} Promise yang menghasilkan array berita
   */
  function ambilBeritaPenerbit(slugPenerbit, jumlah) {
    const urlApi = buatUrlApi(slugPenerbit);
    const namaPenerbit = biografiPenerbit[slugPenerbit].nama;

    return $.get(urlApi)
      .then(function (response) {
        const dataBerita = response.data || [];
        return dataBerita.slice(0, jumlah).map(function (berita) {
          return {
            berita: berita,
            slugPenerbit: slugPenerbit,
            namaPenerbit: namaPenerbit,
          };
        });
      })
      .catch(function () {
        return [];
      });
  }

  /**
   * Render satu kartu berita populer
   * @param {jQuery} $kartu - Element jQuery kartu
   * @param {Object} item - Data berita dan penerbit
   */
  function renderKartuPopuler($kartu, item) {
    $kartu.find("img").attr({
      src: item.berita.image.small,
      alt: item.berita.title,
    });

    $kartu
      .find(".card-date")
      .html(
        `<p class="card-date">${formatTanggal(
          item.berita.isoDate
        )} | <span><a href="/pages/profile-penerbit.html?penerbit=${
          item.slugPenerbit
        }" class="card-publisher">${item.namaPenerbit}</a></span></p>`
      );

    // Ganti href dengan onclick event untuk title link
    $kartu
      .find(".card-title a")
      .text(item.berita.title)
      .attr("href", "javascript:void(0)")
      .on("click", function (e) {
        e.preventDefault();
        setDetailBerita(item.berita, item.slugPenerbit, item.namaPenerbit);
      });

    $kartu
      .find(".card-description")
      .text(
        potongTeks(
          item.berita.contentSnippet || "",
          MAKSIMAL_KARAKTER_DESKRIPSI_POPULER
        )
      );

    // card-actions untuk include bookmark button
    const beritaId = generateBeritaId(item.berita);
    const bookmarked = isBookmarked(beritaId);
    const iconClass = bookmarked ? "bxs-bookmark" : "bx-bookmark";
    const buttonClass = bookmarked ? "bookmarked" : "";

    $kartu.find(".card-actions").html(`
    <a href="javascript:void(0)" class="news-link">Baca Selengkapnya</a>
    <button class="bookmark-btn ${buttonClass}">
      <i class='bx ${iconClass}'></i>
    </button>
  `);

    // Re-attach event untuk "Baca Selengkapnya"
    $kartu.find(".news-link").on("click", function (e) {
      e.preventDefault();
      setDetailBerita(item.berita, item.slugPenerbit, item.namaPenerbit);
    });

    // Initialize bookmark button
    const $bookmarkBtn = $kartu.find(".bookmark-btn");
    initBookmarkButton($bookmarkBtn, item);
  }

  // ============================================
  // SECTION 3: BERITA BERDASARKAN KATEGORI
  // ============================================

  /**
   * Mengambil berita berdasarkan kategori dari semua penerbit
   * @param {string} kategori - Kategori berita (contoh: 'teknologi', 'olahraga')
   * @param {string} selectorKontainer - Selector jQuery untuk kontainer berita
   */
  function ambilBeritaKategori(kategori, selectorKontainer) {
    const $kontainer = $(selectorKontainer);
    const promiseKategori = [];

    semuaPenerbit.forEach(function (slugPenerbit) {
      const urlKategori = buatUrlApi(slugPenerbit, kategori);
      const namaPenerbit = biografiPenerbit[slugPenerbit].nama;

      const promise = $.get(urlKategori)
        .then(function (response) {
          const beritaKategori = response.data || [];
          if (beritaKategori.length === 0) {
            return [];
          }
          return beritaKategori
            .slice(0, JUMLAH_BERITA_PER_PENERBIT)
            .map(function (berita) {
              return {
                berita: berita,
                slugPenerbit: slugPenerbit,
                namaPenerbit: namaPenerbit,
              };
            });
        })
        .catch(function () {
          return [];
        });

      promiseKategori.push(promise);
    });

    Promise.all(promiseKategori).then(function (hasil) {
      const semuaBeritaKategori = hasil.flat();

      if (semuaBeritaKategori.length === 0) {
        return;
      }

      semuaBeritaKategori
        .slice(0, MAKSIMAL_BERITA_KATEGORI)
        .forEach(function (item, index) {
          renderKartuUpdate($kontainer, item, index);
        });
    });
  }

  /**
   * Render kartu berita update (featured atau regular)
   * @param {jQuery} $kontainer - Kontainer kategori
   * @param {Object} item - Data berita
   * @param {number} index - Index berita (0 untuk featured, >0 untuk regular)
   */
  function renderKartuUpdate($kontainer, item, index) {
    if (index === 0) {
      renderKartuFeatured($kontainer, item);
    } else {
      renderKartuRegular($kontainer, item, index - 1);
    }
  }

  /**
   * Render kartu berita featured (berita utama dalam kategori)
   * @param {jQuery} $kontainer - Kontainer kategori
   * @param {Object} item - Data berita
   */
  function renderKartuFeatured($kontainer, item) {
    const $kartuFeatured = $kontainer.find(".update-card.featured");

    $kartuFeatured.find(".update-img-container img").attr({
      src: item.berita.image.small,
      alt: item.berita.title,
    });

    $kartuFeatured.find(".update-title").text(item.berita.title);

    $kartuFeatured
      .find(".update-description")
      .html(
        `${potongTeks(
          item.berita.contentSnippet || "",
          MAKSIMAL_KARAKTER_DESKRIPSI_UPDATE
        )} `
      );

    // Ganti wrap dengan onclick event
    if (!$kartuFeatured.parent().is("a")) {
      $kartuFeatured.css("cursor", "pointer");
    }

    $kartuFeatured.off("click").on("click", function (e) {
      e.preventDefault();
      setDetailBerita(item.berita, item.slugPenerbit, item.namaPenerbit);
    });
  }

  /**
   * Render kartu berita regular (berita tambahan dalam kategori)
   * @param {jQuery} $kontainer - Kontainer kategori
   * @param {Object} item - Data berita
   * @param {number} indexKartu - Index kartu regular
   */
  function renderKartuRegular($kontainer, item, indexKartu) {
    const $kartuRegular = $kontainer.find(".update-card:not(.featured)");

    if (indexKartu < $kartuRegular.length) {
      const $kartu = $kartuRegular.eq(indexKartu);
      $kartu.find(".update-title").html(`${item.berita.title} `);

      // Ganti wrap dengan onclick event
      if (!$kartu.parent().is("a")) {
        $kartu.css("cursor", "pointer");
      }

      $kartu.off("click").on("click", function (e) {
        e.preventDefault();
        setDetailBerita(item.berita, item.slugPenerbit, item.namaPenerbit);
      });
    }
  }

  // ============================================
  // SECTION 4: RENDER SEMUA KATEGORI
  // ============================================

  /**
   * Render berita update untuk semua kategori yang tersedia
   */
  function renderSemuaKategori() {
    const kategoriTampil = KATEGORI_TERSEDIA.slice(0, MAKSIMAL_KATEGORI_TAMPIL);

    kategoriTampil.forEach(function (kategori, index) {
      const selectorKontainer = `.update-news .update-category:nth-child(${
        index + 1
      })`;

      const namaKategoriTerformat = kategori
        .replace(/-/g, " ")
        .replace(/\b\w/g, (huruf) => huruf.toUpperCase());

      $(`${selectorKontainer} .category-header h2`).text(namaKategoriTerformat);

      ambilBeritaKategori(kategori, selectorKontainer);
    });
  }

  // ============================================
  // EKSEKUSI UTAMA
  // ============================================

  renderBeritaUtama();
  renderBeritaPopuler();
  renderSemuaKategori();
});

// ============================================
// FUNGSI UTILITAS
// ============================================

/**
 * Memformat tanggal ISO ke format Indonesia (contoh: 7 Oktober)
 * @param {string} tanggalISO - Tanggal dalam format ISO cth: "2025-10-07T02:48:30.000Z"
 * @returns {string} Tanggal terformat dalam Bahasa Indonesia
 */
function formatTanggal(tanggalISO) {
  const tanggal = new Date(tanggalISO);
  const opsi = { day: "numeric", month: "long" };
  return tanggal.toLocaleDateString("id-ID", opsi);
}

/**
 * Memotong teks hingga panjang maksimal tertentu
 * @param {string} teks - Teks yang akan dipotong
 * @param {number} panjangMaksimal - Panjang maksimal teks
 * @returns {string} Teks yang telah dipotong dengan "..." di akhir
 */
function potongTeks(teks, panjangMaksimal) {
  if (!teks || teks.length === 0) return "";
  if (teks.length > panjangMaksimal) {
    return teks.substring(0, panjangMaksimal) + "...";
  }
  return teks;
}

/**
 * Membuat URL API untuk penerbit tertentu
 * @param {string} slugPenerbit - Kunci penerbit
 * @param {string} kategori - Kategori berita (opsional)
 * @returns {string} URL API lengkap
 */
function buatUrlApi(slugPenerbit, kategori = "") {
  const baseUrl = `https://berita-indo-api.vercel.app/v1/${slugPenerbit}`;
  return kategori ? `${baseUrl}/${kategori}` : baseUrl; 
}

