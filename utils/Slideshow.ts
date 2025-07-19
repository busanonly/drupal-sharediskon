// utils/Slideshow.ts

import { drupal } from "../lib/drupal";

// Mendefinisikan struktur data yang bersih untuk setiap item slideshow.
export interface Slide {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

/**
 * Mengambil semua item dari tipe konten Slideshow.
 * Fungsi ini mengambil gambar asli dari field_slideshow dan link dari field_link.
 * @returns {Promise<Slide[]>} Sebuah array dari objek Slide.
 */
export async function getSlideshowItems(): Promise<Slide[]> {
  try {
    // Mengambil koleksi resource dari tipe konten 'node--slideshow'.
    const slideshowNodes = await drupal.getResourceCollection<any[]>(
      "node--slideshow",
      {
        params: {
          // Meminta Drupal untuk menyertakan data dari relasi gambar.
          include: "field_slideshow",
          // Mengurutkan berdasarkan tanggal dibuat, yang terbaru lebih dulu.
          sort: "-created",
        },
      }
    );

    // Jika tidak ada node slideshow, kembalikan array kosong.
    if (!slideshowNodes || slideshowNodes.length === 0) {
      console.log("No slideshow nodes found.");
      return [];
    }

    // Memproses setiap node menjadi struktur Slide yang lebih bersih.
    const slides: Slide[] = slideshowNodes.map((node) => {
        const image = node.field_slideshow;
        const link = node.field_link;

        // Pastikan semua data yang dibutuhkan ada.
        if (image && image.uri?.url && link && link.uri) {
          // Membuat URL gambar menjadi absolut.
          const imageUrl = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${image.uri.url}`;
          
          return {
            id: node.id,
            imageUrl: imageUrl,
            linkUrl: link.uri, // Mengambil URL dari field link
            title: image.meta?.alt || node.title, // Menggunakan alt text gambar atau judul node
          };
        }
        
        return null;
      })
      .filter((slide): slide is Slide => slide !== null); // Menyaring hasil yang null

    return slides;

  } catch (error) {
    // Menangani jika terjadi error saat fetching.
    console.error("Failed to fetch slideshow items:", error);
    return [];
  }
}
