// utils/Slideshow.ts

import { drupal } from "../lib/drupal";
import { fetchWithRetry } from "./KatalogCard"; // <<< PERBAIKAN DI SINI: IMPORT fetchWithRetry

export interface Slide {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  link: string;
}

/**
 * Mengambil item slideshow dari Drupal.
 * @returns {Promise<Slide[]>} Sebuah array dari objek Slide.
 */
export async function getSlideshowItems(): Promise<Slide[]> {
  console.log("getSlideshowItems - Attempting to fetch slideshow items."); // Log awal
  try {
    // PERBAIKAN DI SINI: Menggunakan fetchWithRetry untuk pengambilan koleksi sumber daya
    const slideshowNodes = await fetchWithRetry(async () => {
      return await drupal.getResourceCollection<any[]>(
        "node--slideshow",
        {
          params: {
            include: "field_slideshow", // Sertakan relasi gambar slideshow
            sort: "-created",
            "page[limit]": 5, // Batasi jumlah slide yang diambil (sesuaikan jika perlu)
          },
        }
      );
    }, 3, 1500); // Coba 3 kali, mulai dengan delay 1.5 detik

    console.log(`getSlideshowItems - Fetched ${slideshowNodes ? slideshowNodes.length : 0} raw nodes.`); // Log jumlah node mentah

    if (!slideshowNodes || slideshowNodes.length === 0) {
      console.warn("getSlideshowItems - No slideshow nodes found."); // Log jika tidak ditemukan
      return [];
    }

    const slides: Slide[] = slideshowNodes
      .map((node) => {
        const slideImage = node.field_slideshow; // Asumsi ini adalah objek gambar tunggal

        if (!slideImage || (!slideImage.uri?.url)) { // Cek hanya uri.url karena tidak ada styles di sini
          console.warn(`Skipping slideshow item for node ${node.id} due to missing image URL.`);
          return null;
        }

        const imageUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${slideImage.uri.url}`;

        return {
          id: node.id,
          imageUrl: imageUrl,
          alt: slideImage.alt || node.title,
          title: node.title,
          link: node.path?.alias || "#", // Menggunakan path alias sebagai link, fallback ke #
        };
      })
      .filter((slide): slide is Slide => slide !== null); // Filter entri null

    console.log(`getSlideshowItems - Returning ${slides.length} final slides.`); // Log jumlah slide akhir
    return slides;

  } catch (error) {
    console.error("getSlideshowItems - Failed to fetch slideshow items after retries:", error); // Log error
    return [];
  }
}
