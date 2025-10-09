import {
    setDetailBerita,
    initBookmarkButton,
    generateBeritaId,
    isBookmarked
} from '/public/js/ultilitas/ultility.js';

import { biografiPenerbit } from './data/biografiPenerbit.js';

// ============================================
// KONSTANTA DAN KONFIGURASI
// ============================================
const ITEMS_PER_PAGE = 9;
const MAX_DESCRIPTION_LENGTH = 150;
const semuaPenerbit = Object.keys(biografiPenerbit);

// ============================================
// STATE MANAGEMENT
// ============================================
let currentPage = 1;
let allNewsData = [];
let currentCategory = '';
let publisherDataMap = new Map(); // Map untuk menyimpan data publisher per berita

// ============================================
// DOM ELEMENTS
// ============================================
const newsContainer = $("#news-container");
const loadingIndicator = $("#loading");
const categoryTitle = $("#category-title");
const paginationContainer = $("#pagination-container");

$(document).ready(function() {
    initializePage();
});

// ============================================
// INITIALIZATION
// ============================================
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("kategori");

    if (!category) {
        showError("Kategori Tidak Ditemukan", "Silakan pilih kategori dari halaman utama.");
        return;
    }

    currentCategory = category;
    updateCategoryTitle(category);
    loadCategoryNews(category);
    setupPaginationEvents();
}

// ============================================
// DATA FETCHING
// ============================================
/**
 * Memuat berita dari semua penerbit untuk kategori tertentu
 * @param {string} category - Kategori berita
 */
function loadCategoryNews(category) {
    loadingIndicator.show();

    const fetchPromises = semuaPenerbit.map(slugPenerbit =>
        fetchNewsFromPublisher(slugPenerbit, category)
    );

    Promise.all(fetchPromises)
        .then(results => {
            allNewsData = results.flat();
            loadingIndicator.hide();

            if (allNewsData.length > 0) {
                renderNewsPage(1);
            } else {
                showNoNews();
            }
        })
        .catch(error => {
            loadingIndicator.hide();
            console.error('Error loading category news:', error);
            showError("Gagal Memuat Berita", "Silakan coba lagi nanti.");
        });
}

/**
 * Mengambil berita dari satu penerbit
 * @param {string} slugPenerbit - Slug penerbit
 * @param {string} category - Kategori berita
 * @returns {Promise<Array>} Array berita dengan data publisher
 */
function fetchNewsFromPublisher(slugPenerbit, category) {
    const apiUrl = buatUrlApi(slugPenerbit, category);
    const publisherInfo = biografiPenerbit[slugPenerbit];

    return $.get(apiUrl)
        .then(response => {
            const beritaList = response.data || [];

            // Simpan data publisher untuk setiap berita
            return beritaList.map(berita => {
                const beritaId = generateBeritaId(berita);
                publisherDataMap.set(beritaId, {
                    slug: slugPenerbit,
                    name: publisherInfo.nama
                });

                return berita;
            });
        })
        .catch(error => {
            console.warn(`Failed to fetch from ${slugPenerbit}:`, error);
            return [];
        });
}

// ============================================
// RENDERING FUNCTIONS
// ============================================
/**
 * Render halaman berita dengan pagination
 * @param {number} page - Nomor halaman
 */
function renderNewsPage(page) {
    currentPage = page;
    newsContainer.empty();

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newsForPage = allNewsData.slice(startIndex, endIndex);

    newsForPage.forEach((berita, index) => {
        const actualIndex = startIndex + index;
        const newsCard = createNewsCard(berita, actualIndex);
        newsContainer.append(newsCard);
    });

    initializeInteractions();
    renderPaginationControls();
    scrollToTop();
}

/**
 * Membuat HTML untuk kartu berita
 * @param {Object} berita - Data berita
 * @param {number} index - Index berita dalam allNewsData
 * @returns {string} HTML string
 */
function createNewsCard(berita, index) {
    const beritaId = generateBeritaId(berita);
    const publisherData = publisherDataMap.get(beritaId) || {
        slug: 'unknown',
        name: 'Unknown Publisher'
    };

    const formattedDate = formatTanggal(berita.isoDate);
    const bookmarked = isBookmarked(beritaId);
    const bookmarkIconClass = bookmarked ? 'bxs-bookmark' : 'bx-bookmark';
    const bookmarkActiveClass = bookmarked ? 'bookmarked' : '';
    const imageUrl = berita.image.small;
    const description = potongTeks(berita.contentSnippet || berita.description || '', MAX_DESCRIPTION_LENGTH);

    return `
        <div class="card">
            <div class="card-image-wrapper">
                <img src="${imageUrl}" alt="${berita.title || 'News Image'}" />
            </div>
            <div class="card-content">
                <p class="card-date">
                    ${formattedDate} | 
                    <span>
                        <a href="/pages/profile-penerbit.html?penerbit=${publisherData.slug}" class="card-publisher">
                            ${publisherData.name}
                        </a>
                    </span>
                </p>
                <h2 class="card-title">
                    <a href="javascript:void(0)" class="detail-btn" data-index="${index}">
                        ${berita.title}
                    </a>
                </h2>
                <p class="card-description">
                    ${description}
                </p>
                <div class="card-actions">
                    <a href="javascript:void(0)" class="news-link detail-link" data-index="${index}">
                        Baca Selengkapnya
                    </a>
                    <button class="bookmark-btn ${bookmarkActiveClass}" data-berita-id="${beritaId}">
                        <i class="bx ${bookmarkIconClass}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Inisialisasi semua interaksi (bookmark, detail buttons)
 */
function initializeInteractions() {
    initializeBookmarkButtons();
    initializeDetailButtons();
}

/**
 * Inisialisasi bookmark buttons
 */
function initializeBookmarkButtons() {
    $('.bookmark-btn').each(function() {
        const $btn = $(this);
        const beritaId = $btn.data('berita-id');
        const berita = allNewsData.find(item => generateBeritaId(item) === beritaId);

        if (berita) {
            const publisherData = publisherDataMap.get(beritaId);
            const dataBerita = {
                berita: berita,
                slugPenerbit: publisherData.slug,
                namaPenerbit: publisherData.name
            };

            initBookmarkButton($btn, dataBerita);
        }
    });
}

/**
 * Inisialisasi detail buttons (title dan "Baca Selengkapnya")
 */
function initializeDetailButtons() {
    $('.detail-btn, .detail-link').off('click').on('click', function(e) {
        e.preventDefault();
        const index = $(this).data('index');
        const berita = allNewsData[index];

        if (berita) {
            const beritaId = generateBeritaId(berita);
            const publisherData = publisherDataMap.get(beritaId);
            setDetailBerita(berita, publisherData.slug, publisherData.name);
        }
    });
}

// ============================================
// PAGINATION
// ============================================
/**
 * Render kontrol pagination
 */
function renderPaginationControls() {
    paginationContainer.empty();

    const totalPages = Math.ceil(allNewsData.length / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = `
        <button class="pagination-btn" id="prev-page" ${currentPage === 1 ? "disabled" : ""}>
            Previous
        </button>
    `;
    paginationContainer.append(prevButton);

    // Page numbers with ellipsis
    renderPageNumbers(totalPages);

    // Next button
    const nextButton = `
        <button class="pagination-btn" id="next-page" ${currentPage === totalPages ? "disabled" : ""}>
            Next
        </button>
    `;
    paginationContainer.append(nextButton);
}

/**
 * Render nomor halaman dengan ellipsis
 * @param {number} totalPages - Total halaman
 */
function renderPageNumbers(totalPages) {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
        paginationContainer.append(createPageButton(1));
        if (startPage > 2) {
            paginationContainer.append(`<span class="pagination-ellipsis">...</span>`);
        }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.append(createPageButton(i, i === currentPage));
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationContainer.append(`<span class="pagination-ellipsis">...</span>`);
        }
        paginationContainer.append(createPageButton(totalPages));
    }
}

/**
 * Membuat button halaman
 * @param {number} pageNum - Nomor halaman
 * @param {boolean} isActive - Status aktif
 * @returns {string} HTML button
 */
function createPageButton(pageNum, isActive = false) {
    return `
        <button class="pagination-btn page-number ${isActive ? 'active' : ''}" data-page="${pageNum}">
            ${pageNum}
        </button>
    `;
}

/**
 * Setup event handlers untuk pagination
 */
function setupPaginationEvents() {
    paginationContainer.on("click", ".page-number", function() {
        const page = parseInt($(this).data("page"));
        renderNewsPage(page);
    });

    paginationContainer.on("click", "#prev-page", function() {
        if (currentPage > 1) {
            renderNewsPage(currentPage - 1);
        }
    });

    paginationContainer.on("click", "#next-page", function() {
        const totalPages = Math.ceil(allNewsData.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            renderNewsPage(currentPage + 1);
        }
    });
}

// ============================================
// UI HELPERS
// ============================================
/**
 * Update judul kategori
 * @param {string} category - Kategori
 */
function updateCategoryTitle(category) {
    const formattedTitle = category
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    categoryTitle.text(`Berita Kategori: ${formattedTitle}`);
}

/**
 * Tampilkan pesan tidak ada berita
 */
function showNoNews() {
    newsContainer.html(
        '<p class="no-news">Tidak ada berita yang ditemukan untuk kategori ini.</p>'
    );
}

/**
 * Tampilkan pesan error
 * @param {string} title - Judul error
 * @param {string} message - Pesan error
 */
function showError(title, message) {
    categoryTitle.text(title);
    newsContainer.html(`<p class="error-message">${message}</p>`);
}

/**
 * Scroll ke atas halaman
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
/**
 * Format tanggal ISO ke format Indonesia
 * @param {string} isoDate - Tanggal ISO
 * @returns {string} Tanggal terformat
 */
function formatTanggal(isoDate) {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Potong teks hingga panjang maksimal
 * @param {string} text - Teks
 * @param {number} maxLength - Panjang maksimal
 * @returns {string} Teks terpotong
 */
function potongTeks(text, maxLength) {
    if (!text || text.length === 0) return '';
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

/**
 * Membuat URL API
 * @param {string} slugPenerbit - Slug penerbit
 * @param {string} category - Kategori
 * @returns {string} URL API
 */
function buatUrlApi(slugPenerbit, category = '') {
    const baseUrl = `https://berita-indo-api.vercel.app/v1/${slugPenerbit}`;
    return category ? `${baseUrl}/${category}` : baseUrl;
}