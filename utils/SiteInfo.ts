// utils/SiteInfo.ts

import { drupal } from "../lib/drupal"; // Mengimpor instance DrupalClient untuk interaksi API

/**
 * Mendefinisikan antarmuka untuk struktur data informasi situs.
 */
export interface SiteInfo {
  title: string;       // Judul situs (dari field_site_title atau field_nama_site)
  description: string; // Deskripsi meta (dari body.value)
  keywords: string;    // Kata kunci (dari field_keyword)
}

/**
 * Mengambil informasi situs dari Drupal JSON:API.
 * Diasumsikan hanya ada satu node 'site_info'.
 * @returns {Promise<SiteInfo | null>} Objek SiteInfo atau null jika tidak ditemukan.
 */
export async function getSiteInfo(): Promise<SiteInfo | null> {
  try {
    // Mengambil koleksi node 'site_info'.
    // Karena biasanya hanya ada satu node site_info, kita akan mengambil yang pertama.
    const siteInfoNodes = await drupal.getResourceCollection<any[]>(
      "node--site_info",
      {
        params: {
          // Sertakan field yang relevan sebagai atribut.
          // field_site_title, field_nama_site, body, dan field_keyword adalah atribut,
          // jadi tidak perlu di 'include' sebagai relasi.
          "filter[status]": 1, // Hanya ambil node yang dipublikasikan
          "page[limit]": 1,    // Hanya ambil satu node
        },
      }
    );

    // Jika tidak ada node site_info yang ditemukan atau array kosong
    if (!siteInfoNodes || siteInfoNodes.length === 0) {
      console.warn("No site_info node found in Drupal.");
      return null;
    }

    const node = siteInfoNodes[0]; // Mengambil node pertama (dan seharusnya satu-satunya)

    // Mengekstrak data dari atribut node
    // Prioritaskan field_site_title, jika tidak ada, gunakan field_nama_site
    const title = node.field_site_title || node.field_nama_site || "Sharediskon";
    const description = node.body?.value || "Temukan promo dan diskon terbaru.";
    const keywords = node.field_keyword || "promo, diskon, hemat, belanja";

    return {
      title: title,
      description: description,
      keywords: keywords,
    };

  } catch (error) {
    console.error("Failed to fetch site info:", error);
    return null;
  }
}
