// utils/LogoCard.ts

import { drupal } from "../lib/drupal";

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
  try {
    const logoNodes = await drupal.getResourceCollection<any[]>(
      "node--landing_page", // Asumsi landing_page adalah tipe konten untuk logo cards
      {
        params: {
          include: "field_logo_card", // Sertakan relasi gambar logo
          "filter[field_kategori.name]": categoryName, // Filter berdasarkan nama kategori
          "page[limit]": 6, // Batasi jumlah logo yang diambil
        },
      }
    );

    if (!logoNodes || logoNodes.length === 0) {
      console.warn(`No logo cards found for category: ${categoryName}`);
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
        // PERUBAHAN DI SINI: Prioritaskan image_style_uri.logo, fallback ke original
        if (logoImage.image_style_uri && logoImage.image_style_uri.logo) {
          imageUrl = logoImage.image_style_uri.logo;
        } else if (logoImage.uri && logoImage.uri.url) {
          imageUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${logoImage.uri.url}`;
        } else {
          return null; // Jika tidak ada URL gambar yang valid, lewati kartu ini
        }

        return {
          id: node.id,
          imageUrl: imageUrl,
          alt: logoImage.alt || node.title,
          category: categoryName,
        };
      })
      .filter((card): card is LogoCard => card !== null); // Filter entri null

    return logoCards;

  } catch (error) {
    console.error(`Failed to fetch logo cards for category ${categoryName}:`, error);
    return [];
  }
}
