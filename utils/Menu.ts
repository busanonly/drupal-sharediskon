// utils/Menu.ts

import { drupal } from "../lib/drupal"

// Mendefinisikan struktur data yang bersih untuk setiap item menu.
// Ini membantu memastikan tipe data yang konsisten di seluruh aplikasi.
export interface MenuItem {
  id: string
  title: string
  url: string
}

/**
 * Mengambil item menu utama dari Drupal.
 * Fungsi ini mengambil data dari endpoint menu 'main',
 * menyaring item yang tidak aktif, dan mengurutkannya berdasarkan 'weight'.
 * @returns {Promise<MenuItem[]>} Sebuah array dari item menu yang sudah diproses.
 */
export async function getMainMenuLinks(): Promise<MenuItem[]> {
  try {
    // Menggunakan drupal.fetch untuk mengambil data langsung dari endpoint JSON:API.
    // Ini adalah alternatif yang lebih andal jika getCollection tidak tersedia.
    // URL yang digunakan adalah path relatif, karena base URL sudah dikonfigurasi di lib/drupal.ts.
    const response = await drupal.fetch("/jsonapi/menu_items/main")

    // Jika respons tidak OK (misalnya, error 404 atau 500), lemparkan error.
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // Parse data JSON dari respons.
    const menuData = await response.json()
    const menuItems = menuData.data // Item menu berada di dalam properti 'data'.

    // Memproses data mentah dari Drupal menjadi struktur MenuItem yang lebih bersih.
    // Ini juga menyaring item menu yang dinonaktifkan (enabled: false) dan mengurutkannya.
    if (menuItems && Array.isArray(menuItems)) {
      return menuItems
        .filter((item) => item.attributes.enabled)
        .sort((a, b) => a.attributes.weight - b.attributes.weight) // Menambahkan pengurutan di sini
        .map((item) => ({
          id: item.id,
          title: item.attributes.title,
          url: item.attributes.url,
        }))
    }

    // Jika tidak ada data, kembalikan array kosong.
    return []
  } catch (error) {
    // Jika terjadi error saat fetching, tampilkan di console dan kembalikan array kosong.
    // Ini mencegah aplikasi crash jika API tidak dapat dijangkau.
    console.error("Failed to fetch main menu:", error)
    return []
  }
}
