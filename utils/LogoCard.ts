// utils/LogoCard.ts

import { drupal } from "../lib/drupal";

export interface LogoCard {
  id: string;
  imageUrl: string;
  alt: string;
}

/**
 * Mengambil daftar Logo Card, difilter berdasarkan NAMA kategori.
 * @param {string} categoryName - Nama dari term taksonomi kategori untuk difilter.
 * @returns {Promise<LogoCard[]>} Sebuah array dari objek LogoCard.
 */
export async function getLogoCards(categoryName: string): Promise<LogoCard[]> {
  try {
    const landingPages = await drupal.getResourceCollection<any[]>(
      "node--landing_page",
      {
        params: {
          include: "field_logo_card",
          "page[limit]": 6,
          // FIX: Mengubah filter untuk menggunakan nama kategori.
          "filter[field_kategori.name]": categoryName,
        },
      }
    );

    if (!landingPages || landingPages.length === 0) {
      return [];
    }

    const allLogoCards: LogoCard[] = landingPages
      .map((page) => {
        const logo = page.field_logo_card;
        if (!logo) return null;

        let imageUrl = "";

        if (logo.image_style_uri && logo.image_style_uri.medium) {
          imageUrl = logo.image_style_uri.medium;
        } else if (logo.uri && logo.uri.url) {
          imageUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${logo.uri.url}`;
        } else {
          return null;
        }

        return {
          id: logo.id,
          imageUrl: imageUrl,
          alt: logo.meta?.alt || `Logo ${logo.id}`,
        };
      })
      .filter((card): card is LogoCard => card !== null);

    return allLogoCards;
  } catch (error) {
    console.error(`Failed to fetch logo cards for category ${categoryName}:`, error);
    return [];
  }
}
