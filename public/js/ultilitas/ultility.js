// // ============================================
// // FUNGSI UTILITAS UNTUK MENYIMPAN DETAILBERITA KE LOCALSTORAGE
// // ============================================

// /**
//  * Menyimpan detail berita ke localStorage dan redirect ke halaman detail
//  * @param {Object} berita - Data berita lengkap
//  * @param {string} slugPenerbit - Kunci penerbit (opsional)
//  * @param {string} namaPenerbit - Nama penerbit (opsional)
//  */
// export function setDetailBerita(berita, slugPenerbit = "", namaPenerbit = "") {
//   try {
//     const detailBerita = {
//       title: berita.title,
//       link: berita.link,
//       image: berita.image,
//       contentSnippet: berita.contentSnippet || "",
//       isoDate: berita.isoDate,
//       slugPenerbit: slugPenerbit,
//       namaPenerbit: namaPenerbit,
//       timestamp: new Date().toISOString(),
//     };

//     localStorage.setItem("DetailBerita", JSON.stringify(detailBerita));

//     // Redirect ke halaman detail (sesuaikan dengan path Anda)
//     window.location.href = "/pages/detail-berita.html";
//   } catch (error) {
//     // Fallback: buka link asli jika gagal
//     window.open(berita.link, "_blank");
//   }
// }

// // ============================================
// // SISTEM BOOKMARK - ultilitas.js
// // ============================================

// /**
//  * Generate ID unik untuk berita berdasarkan link
//  * @param {Object} berita - Data berita
//  * @returns {string} ID unik berita
//  */
// export function generateBeritaId(berita) {
//   return berita.link || `${berita.title}-${berita.isoDate}`;
// }

// /**
//  * Mengambil semua bookmark dari localStorage
//  * @returns {Array} Array berisi data bookmark
//  */
// export function getBookmarks() {
//   try {
//     const bookmarks = localStorage.getItem("bookmarks");
//     return bookmarks ? JSON.parse(bookmarks) : [];
//   } catch (error) {
//     console.error("Error saat membaca bookmark:", error);
//     return [];
//   }
// }

// /**
//  * Menambahkan bookmark ke localStorage
//  * @param {Object} bookmarkData - Data bookmark yang akan disimpan
//  * @returns {boolean} True jika berhasil
//  */
// export function addBookmark(bookmarkData) {
//   try {
//     const bookmarks = getBookmarks();

//     // Cek apakah sudah ada
//     const exists = bookmarks.some((item) => item.id === bookmarkData.id);
//     if (exists) {
//       console.log("Berita sudah ada di bookmark");
//       return false;
//     }

//     bookmarks.unshift(bookmarkData); // Tambahkan di awal array
//     localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
//     console.log("Bookmark berhasil ditambahkan:", bookmarkData.berita.title);
//     return true;
//   } catch (error) {
//     console.error("Error saat menambah bookmark:", error);
//     return false;
//   }
// }

// /**
//  * Menghapus bookmark dari localStorage
//  * @param {string} beritaId - ID berita yang akan dihapus
//  * @returns {boolean} True jika berhasil
//  */
// export function removeBookmark(beritaId) {
//   try {
//     let bookmarks = getBookmarks();
//     const initialLength = bookmarks.length;
//     bookmarks = bookmarks.filter((item) => item.id !== beritaId);

//     if (bookmarks.length === initialLength) {
//       console.log("Bookmark tidak ditemukan");
//       return false;
//     }

//     localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
//     console.log("Bookmark berhasil dihapus:", beritaId);
//     return true;
//   } catch (error) {
//     console.error("Error saat menghapus bookmark:", error);
//     return false;
//   }
// }

// /**
//  * Cek apakah berita sudah di-bookmark
//  * @param {string} beritaId - ID berita
//  * @returns {boolean} True jika sudah di-bookmark
//  */
// export function isBookmarked(beritaId) {
//   const bookmarks = getBookmarks();
//   return bookmarks.some((item) => item.id === beritaId);
// }

// /**
//  * Mendapatkan jumlah total bookmark
//  * @returns {number} Jumlah bookmark
//  */
// export function getBookmarkCount() {
//   return getBookmarks().length;
// }

// /**
//  * Mencari bookmark berdasarkan ID
//  * @param {string} beritaId - ID berita
//  * @returns {Object|null} Data bookmark atau null jika tidak ditemukan
//  */
// export function getBookmarkById(beritaId) {
//   const bookmarks = getBookmarks();
//   return bookmarks.find((item) => item.id === beritaId) || null;
// }

// /**
//  * Menghapus semua bookmark
//  * @returns {boolean} True jika berhasil
//  */
// export function clearAllBookmarks() {
//   try {
//     localStorage.removeItem("bookmarks");
//     console.log("Semua bookmark berhasil dihapus");
//     return true;
//   } catch (error) {
//     console.error("Error saat menghapus semua bookmark:", error);
//     return false;
//   }
// }

// /**
//  * Toggle status bookmark (tambah/hapus)
//  * @param {Object} dataBerita - Data berita lengkap dengan format {berita, slugPenerbit, namaPenerbit}
//  * @returns {Object} {success: boolean, action: 'added'|'removed'}
//  */
// export function toggleBookmark(dataBerita) {
//   const beritaId = generateBeritaId(dataBerita.berita);
//   const bookmarked = isBookmarked(beritaId);

//   if (bookmarked) {
//     const success = removeBookmark(beritaId);
//     return {
//       success: success,
//       action: "removed",
//     };
//   } else {
//     const bookmarkData = {
//       id: beritaId,
//       berita: dataBerita.berita,
//       slugPenerbit: dataBerita.slugPenerbit,
//       namaPenerbit: dataBerita.namaPenerbit,
//       timestamp: new Date().toISOString(),
//     };
//     const success = addBookmark(bookmarkData);
//     return {
//       success: success,
//       action: "added",
//     };
//   }
// }

// /**
//  * Update tampilan button bookmark
//  * @param {jQuery} $btn - Element button
//  * @param {boolean} bookmarked - Status bookmark
//  */
// export function updateBookmarkButtonState($btn, bookmarked) {
//   const $icon = $btn.find("i");

//   if (bookmarked) {
//     $btn.addClass("bookmarked");
//     $icon.removeClass("bx-bookmark").addClass("bxs-bookmark");
//   } else {
//     $btn.removeClass("bookmarked");
//     $icon.removeClass("bxs-bookmark").addClass("bx-bookmark");
//   }
// }

// /**
//  * Inisialisasi tombol bookmark dengan data berita
//  * @param {jQuery} $btn - Element button bookmark
//  * @param {Object} dataBerita - Data berita lengkap
//  */
// export function initBookmarkButton($btn, dataBerita) {
//   // Set data berita ke button
//   $btn.data("berita", dataBerita);

//   // Set initial state
//   const beritaId = generateBeritaId(dataBerita.berita);
//   const bookmarked = isBookmarked(beritaId);
//   updateBookmarkButtonState($btn, bookmarked);

//   // Attach event handler
//   $btn.off("click").on("click", function (e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const result = toggleBookmark(dataBerita);
//     updateBookmarkButtonState($btn, result.action === "added");
//   });
// }

// /**
//  * Load status bookmark untuk semua tombol yang ada di halaman
//  */
// export function loadAllBookmarkStates() {
//   $(".bookmark-btn").each(function () {
//     const $btn = $(this);
//     const dataBerita = $btn.data("berita");

//     if (dataBerita) {
//       const beritaId = generateBeritaId(dataBerita.berita);
//       const bookmarked = isBookmarked(beritaId);
//       updateBookmarkButtonState($btn, bookmarked);
//     }
//   });
// }

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

// ============================================
// SISTEM BOOKMARK - ultilitas.js
// ============================================

/**
 * Generate ID unik untuk berita berdasarkan link
 * @param {Object} berita - Data berita
 * @returns {string} ID unik berita
 */
export function generateBeritaId(berita) {
  return berita.link || `${berita.title}-${berita.isoDate}`;
}

/**
 * Mengambil semua bookmark dari localStorage
 * @returns {Array} Array berisi data bookmark
 */
export function getBookmarks() {
  try {
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error("Error saat membaca bookmark:", error);
    return [];
  }
}

/**
 * Menambahkan bookmark ke localStorage
 * @param {Object} bookmarkData - Data bookmark yang akan disimpan
 * @returns {boolean} True jika berhasil
 */
export function addBookmark(bookmarkData) {
  try {
    const bookmarks = getBookmarks();

    // Cek apakah sudah ada
    const exists = bookmarks.some((item) => item.id === bookmarkData.id);
    if (exists) {
      console.log("Berita sudah ada di bookmark");
      return false;
    }

    bookmarks.unshift(bookmarkData); // Tambahkan di awal array
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    console.log("Bookmark berhasil ditambahkan:", bookmarkData.berita.title);
    return true;
  } catch (error) {
    console.error("Error saat menambah bookmark:", error);
    return false;
  }
}

/**
 * Menghapus bookmark dari localStorage
 * @param {string} beritaId - ID berita yang akan dihapus
 * @returns {boolean} True jika berhasil
 */
export function removeBookmark(beritaId) {
  try {
    let bookmarks = getBookmarks();
    const initialLength = bookmarks.length;
    bookmarks = bookmarks.filter((item) => item.id !== beritaId);

    if (bookmarks.length === initialLength) {
      console.log("Bookmark tidak ditemukan");
      return false;
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    console.log("Bookmark berhasil dihapus:", beritaId);
    return true;
  } catch (error) {
    console.error("Error saat menghapus bookmark:", error);
    return false;
  }
}

/**
 * Cek apakah berita sudah di-bookmark
 * @param {string} beritaId - ID berita
 * @returns {boolean} True jika sudah di-bookmark
 */
export function isBookmarked(beritaId) {
  const bookmarks = getBookmarks();
  return bookmarks.some((item) => item.id === beritaId);
}

/**
 * Mendapatkan jumlah total bookmark
 * @returns {number} Jumlah bookmark
 */
export function getBookmarkCount() {
  return getBookmarks().length;
}

/**
 * Mencari bookmark berdasarkan ID
 * @param {string} beritaId - ID berita
 * @returns {Object|null} Data bookmark atau null jika tidak ditemukan
 */
export function getBookmarkById(beritaId) {
  const bookmarks = getBookmarks();
  return bookmarks.find((item) => item.id === beritaId) || null;
}

/**
 * Menghapus semua bookmark
 * @returns {boolean} True jika berhasil
 */
export function clearAllBookmarks() {
  try {
    localStorage.removeItem("bookmarks");
    console.log("Semua bookmark berhasil dihapus");
    return true;
  } catch (error) {
    console.error("Error saat menghapus semua bookmark:", error);
    return false;
  }
}

/**
 * Toggle status bookmark (tambah/hapus)
 * @param {Object} dataBerita - Data berita lengkap dengan format {berita, slugPenerbit, namaPenerbit}
 * @returns {Object} {success: boolean, action: 'added'|'removed'}
 */
export function toggleBookmark(dataBerita) {
  const beritaId = generateBeritaId(dataBerita.berita);
  const bookmarked = isBookmarked(beritaId);

  if (bookmarked) {
    const success = removeBookmark(beritaId);
    return {
      success: success,
      action: "removed",
    };
  } else {
    const bookmarkData = {
      id: beritaId,
      berita: dataBerita.berita,
      slugPenerbit: dataBerita.slugPenerbit,
      namaPenerbit: dataBerita.namaPenerbit,
      timestamp: new Date().toISOString(),
    };
    const success = addBookmark(bookmarkData);
    return {
      success: success,
      action: "added",
    };
  }
}

/**
 * Update tampilan button bookmark
 * @param {jQuery} $btn - Element button
 * @param {boolean} bookmarked - Status bookmark
 */
export function updateBookmarkButtonState($btn, bookmarked) {
  const $icon = $btn.find("i");

  if (bookmarked) {
    $btn.addClass("bookmarked");
    $icon.removeClass("bx-bookmark").addClass("bxs-bookmark");
  } else {
    $btn.removeClass("bookmarked");
    $icon.removeClass("bxs-bookmark").addClass("bx-bookmark");
  }
}

/**
 * Inisialisasi tombol bookmark dengan data berita
 * @param {jQuery} $btn - Element button bookmark
 * @param {Object} dataBerita - Data berita lengkap
 */
export function initBookmarkButton($btn, dataBerita) {
  // Set data berita ke button
  $btn.data("berita", dataBerita);

  // Set initial state
  const beritaId = generateBeritaId(dataBerita.berita);
  const bookmarked = isBookmarked(beritaId);
  updateBookmarkButtonState($btn, bookmarked);

  // Attach event handler
  $btn.off("click").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const result = toggleBookmark(dataBerita);
    updateBookmarkButtonState($btn, result.action === "added");
  });
}

/**
 * Load status bookmark untuk semua tombol yang ada di halaman
 */
export function loadAllBookmarkStates() {
  $(".bookmark-btn").each(function () {
    const $btn = $(this);
    const dataBerita = $btn.data("berita");

    if (dataBerita) {
      const beritaId = generateBeritaId(dataBerita.berita);
      const bookmarked = isBookmarked(beritaId);
      updateBookmarkButtonState($btn, bookmarked);
    }
  });
}

// ============================================
// SISTEM AUTENTIKASI
// ============================================
/**
 * Memeriksa apakah user sudah terautentikasi
 * @returns {boolean} true jika user sudah login, false jika belum
 */
export function isAuth() {
  const userDataFromLocal = localStorage.getItem("userData");
  const userDataFromSession = sessionStorage.getItem("userData");

  if (!userDataFromLocal && !userDataFromSession) {
    return false;
  }

  const activeUserSession = userDataFromLocal || userDataFromSession;

  try {
    const sessionData = JSON.parse(activeUserSession);

    if (sessionData && sessionData.email) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Redirect ke halaman login jika user belum terautentikasi
 * @param {string} loginUrl - URL halaman login (default: 'login.html')
 */
export function requireAuth(loginUrl = "login.html") {
  if (!isAuth()) {
    window.location.href = loginUrl;
  }
}

/**
 * Mendapatkan data user yang sedang aktif
 * @returns {Object|null} Data user atau null jika tidak ada
 */
export function getActiveUser() {
  if (!isAuth()) {
    return null;
  }

  const activeUserSession =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");

  try {
    return JSON.parse(activeUserSession);
  } catch (error) {
    return null;
  }
}
