// utils/LogoCard.ts

import { drupal } from "../lib/drupal";
import { fetchWithRetry } from "./KatalogCard"; // <<< PERBAIKAN DI SINI: IMPORT fetchWithRetry dari KatalogCard

export interface LogoCard {
  id: string;
  imageUrl: string;
  alt: string;
  category: string;
}

/**
 * Mengambil kartu logo berdasarkan nama kategori.
 * @param {string} categoryName - Nama kategori untuk difilter (misalnya "Minimarket", "Supermarket").
 * @returns {Promise<LogoCard[]>} Sebuah array dari objek LogoCard.
 */
export async function getLogoCards(categoryName: string): Promise<LogoCard[]> {
  console.log(`getLogoCards - Attempting to fetch for category: ${categoryName}`); // Log kategori yang diminta
  try {
    // PERBAIKAN DI SINI: Menggunakan fetchWithRetry untuk pengambilan koleksi sumber daya
    const logoNodes = await fetchWithRetry(async () => {
      return await drupal.getResourceCollection<any[]>(
        "node--landing_page", // Asumsi landing_page adalah tipe konten untuk logo cards
        {
          params: {
            include: "field_logo_card", // Sertakan relasi gambar logo
            "filter[field_kategori.name]": categoryName, // Filter berdasarkan nama kategori
            "page[limit]": 6, // Batasi jumlah logo yang diambil
          },
        }
      );
    }, 3, 1500); // Coba 3 kali, mulai dengan delay 1.5 detik (sesuaikan jika perlu)

    console.log(`getLogoCards - Fetched ${logoNodes ? logoNodes.length : 0} raw nodes for category: ${categoryName}`); // Log jumlah node mentah

    if (!logoNodes || logoNodes.length === 0) {
      console.warn(`getLogoCards - No logo cards found for category: ${categoryName}`); // Log jika tidak ditemukan
      return [];
    }

    const logoCards: LogoCard[] = logoNodes
      .map((node) => {
        const logoImage = node.field_logo_card; // Asumsi ini adalah objek gambar tunggal

        if (!logoImage || (!logoImage.image_style_uri && !logoImage.uri?.url)) {
          console.warn(`Skipping logo card for node ${node.id} due to missing image.`);
          return null;
        }

        let imageUrl = "";
        if (logoImage.image_style_uri && logoImage.image_style_uri.logo) {
          imageUrl = logoImage.image_style_uri.logo;
        } else if (logoImage.uri && logoImage.uri.url) {
          imageUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${logoImage.uri.url}`;
        } else {
          return null;
        }

        return {
          id: node.id,
          imageUrl: imageUrl,
          alt: logoImage.alt || node.title,
          category: categoryName,
        };
      })
      .filter((card): card is LogoCard => card !== null); // Filter entri null

    console.log(`getLogoCards - Returning ${logoCards.length} final logo cards for category: ${categoryName}`); // Log jumlah kartu akhir
    return logoCards;

  } catch (error) {
    console.error(`getLogoCards - Failed to fetch logo cards for category ${categoryName} after retries:`, error); // Log error
    return [];
  }
}
