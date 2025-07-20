// utils/KatalogCard.ts

import { drupal } from "../lib/drupal";

// Antarmuka untuk menyimpan URL gambar berdasarkan gaya (style)
export interface ImageStyleUrls {
  thumbnail?: string;
  medium?: string;
  large?: string;
  wide?: string; // Asumsi ada image style 'wide' di Drupal
  original: string; // URL gambar asli, ini harus selalu ada
}

// Antarmuka untuk setiap objek gambar katalog
export interface KatalogImage {
  alt: string; // Alt teks untuk gambar
  urls: ImageStyleUrls; // Objek yang berisi berbagai URL gaya gambar
}

export interface KatalogCard {
  id: string;
  title: string;
  images: KatalogImage[]; // Array dari objek gambar
  storeCategory: string;
  startDate: string;
  endDate: string;
  slug: string;
  body?: string;
}

interface TaxonomyTerm {
  type: string;
  id: string;
  name?: string;
}

/**
 * Fungsi helper untuk melakukan fetch dengan mekanisme retry.
 * @param {Function} fn - Fungsi async yang akan dijalankan (misal: panggilan drupal.getResourceByPath).
 * @param {number} retries - Jumlah percobaan ulang maksimum.
 * @param {number} delay - Penundaan (dalam ms) sebelum mencoba kembali.
 * @returns {Promise<T>} Hasil dari fungsi yang dijalankan.
 */
export async function fetchWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> { // <<< PERBAIKAN DI SINI: TAMBAHKAN 'export'
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch failed, retrying in ${delay}ms... (Retries left: ${retries})`, error);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2); // Eksponensial backoff
    }
    throw error; // Lempar error jika tidak ada retry lagi
  }
}


/**
 * Mengambil item dari tipe konten Katalog Promosi, difilter berdasarkan ID kategori.
 * Digunakan untuk daftar kartu ringkasan.
 * @param {string} categoryId - UUID dari term taksonomi kategori toko untuk difilter.
 * @returns {Promise<KatalogCard[]>} Sebuah array dari objek KatalogCard.
 */
export async function getKatalogCards(categoryId: string): Promise<KatalogCard[]> {
  try {
    // Menggunakan fetchWithRetry untuk pengambilan koleksi sumber daya
    const katalogNodes = await fetchWithRetry(async () => {
      return await drupal.getResourceCollection<any[]>(
        "node--katalog_promosi",
        {
          params: {
            include: "field_gambar_katalog,field_kategori_toko",
            sort: "-created",
            "page[limit]": 50, // Ambil 50 konten terbaru
          },
        }
      );
    }, 3, 1500); // Coba 3 kali, mulai dengan delay 1.5 detik

    if (!katalogNodes || katalogNodes.length === 0) {
      console.warn(`No katalog nodes found for category: ${categoryId}`);
      return [];
    }

    const validKatalogNodes = katalogNodes.filter(node => 
      Array.isArray(node.field_kategori_toko) && 
      node.field_kategori_toko.some((term: TaxonomyTerm) => term.id === categoryId) &&
      node.path && typeof node.path.alias === 'string' && node.path.alias.length > 0
    );

    const katalogCards: KatalogCard[] = validKatalogNodes
      .map((node) => {
        const rawImages = Array.isArray(node.field_gambar_katalog) ? node.field_gambar_katalog : (node.field_gambar_katalog ? [node.field_gambar_katalog] : []);
        const processedImages: KatalogImage[] = rawImages.map((img: any) => {
          const originalUrl = img.uri && img.uri.url ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${img.uri.url}` : "";
          return {
            alt: img.alt || node.title,
            urls: {
              thumbnail: img.image_style_uri?.thumbnail || originalUrl,
              medium: img.image_style_uri?.medium || originalUrl,
              large: img.image_style_uri?.large || originalUrl,
              wide: img.image_style_uri?.wide || originalUrl,
              original: originalUrl,
            }
          };
        }).filter((img: KatalogImage) => img.urls.original !== "");

        if (processedImages.length === 0) {
          console.warn(`Skipping katalog card for node ${node.id} due to no valid images.`);
          return null;
        }

        const categoryTerm = Array.isArray(node.field_kategori_toko) ? node.field_kategori_toko.find((term: TaxonomyTerm) => term.id === node.field_kategori_toko[0]?.id) : undefined;

        if (!categoryTerm) {
          console.warn(`Skipping katalog card for node ${node.id} due to missing category term.`);
          return null;
        }

        return {
          id: node.id,
          title: node.title,
          images: processedImages,
          storeCategory: categoryTerm.name || "Minimarket",
          startDate: node.field_tanggal_mulai,
          endDate: node.field_tanggal_berakhir,
          slug: node.path.alias,
        };
      })
      .filter((card): card is KatalogCard => card !== null);

    return katalogCards;

  } catch (error) {
    console.error(`Failed to fetch logo cards for category ${categoryId} after retries:`, error);
    return [];
  }
}

/**
 * Mengambil detail satu item dari tipe konten Katalog Promosi berdasarkan slug.
 * Digunakan untuk halaman detail.
 * @param {string} slug - Slug (path alias) dari item katalog.
 * @returns {Promise<KatalogCard | null>} Objek KatalogCard tunggal atau null jika tidak ditemukan.
 */
export async function getKatalogDetailBySlug(slug: string): Promise<KatalogCard | null> {
  console.log("Attempting to fetch detail for slug:", slug);

  const cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug;
  console.log("Cleaned slug for getResourceByPath:", cleanSlug);

  try {
    // Menggunakan fetchWithRetry
    const node = await fetchWithRetry(async () => {
      return await drupal.getResourceByPath<any>(cleanSlug, {
        params: {
          include: "field_gambar_katalog,field_kategori_toko",
        },
      });
    }, 3, 2000); // Coba 3 kali, mulai dengan delay 2 detik (2000ms)

    if (!node) {
      console.warn("No node found for slug:", slug);
      return null;
    }

    console.log("Node found for slug:", node.id, node.title);

    const rawImages = Array.isArray(node.field_gambar_katalog) ? node.field_gambar_katalog : (node.field_gambar_katalog ? [node.field_gambar_katalog] : []);
    const processedImages: KatalogImage[] = rawImages.map((img: any) => {
      const originalUrl = img.uri && img.uri.url ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${img.uri.url}` : "";
      return {
        alt: img.alt || node.title,
        urls: {
          thumbnail: img.image_style_uri?.thumbnail || originalUrl,
          medium: img.image_style_uri?.medium || originalUrl,
          large: img.image_style_uri?.large || originalUrl,
          wide: img.image_style_uri?.wide || originalUrl,
          original: originalUrl,
        }
      };
    }).filter((img: KatalogImage) => img.urls.original !== "");

    if (processedImages.length === 0) {
      console.warn(`Incomplete katalog detail data for slug: ${slug}, No valid images found.`);
      return null;
    }

    const categoryTerm = Array.isArray(node.field_kategori_toko) ? node.field_kategori_toko.find((term: TaxonomyTerm) => term.id === node.field_kategori_toko[0]?.id) : undefined;

    if (!categoryTerm || !node.path?.alias) {
      console.warn(`Incomplete katalog detail data for slug: ${slug}, Missing category or alias.`);
      return null;
    }

    return {
      id: node.id,
      title: node.title,
      images: processedImages,
      storeCategory: categoryTerm.name || "Minimarket",
      startDate: node.field_tanggal_mulai,
      endDate: node.field_tanggal_berakhir,
      slug: node.path.alias,
      body: node.body?.processed || "",
    };

  } catch (error) {
    console.error(`Failed to fetch katalog detail for slug ${slug} after retries:`, error);
    return null;
  }
}
