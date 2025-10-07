// ============================================
// FUNGSI UTILITAS UNTUK MENYIMPAN DETAILBERITA KE LOCALSTORAGE
// ============================================

/**
 * Menyimpan detail berita ke localStorage dan redirect ke halaman detail
 * @param {Object} berita - Data berita lengkap
 * @param {string} slugPenerbit - Kunci penerbit (opsional)
 * @param {string} namaPenerbit - Nama penerbit (opsional)
 */
export function setDetailBerita(berita, slugPenerbit = "", namaPenerbit = "") {
  try {
    const detailBerita = {
      title: berita.title,
      link: berita.link,
      image: berita.image,
      contentSnippet: berita.contentSnippet || "",
      isoDate: berita.isoDate,
      slugPenerbit: slugPenerbit,
      namaPenerbit: namaPenerbit,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("DetailBerita", JSON.stringify(detailBerita));

    // Redirect ke halaman detail (sesuaikan dengan path Anda)
    window.location.href = "/pages/detail-berita.html";
  } catch (error) {
    // Fallback: buka link asli jika gagal
    window.open(berita.link, "_blank");
  }
}
