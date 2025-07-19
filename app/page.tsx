// app/page.tsx

import HomePage from "@/components/HomePage";
import { getLogoCards } from "@/utils/LogoCard";
import { getSlideshowItems } from "@/utils/Slideshow";
import { getKatalogCards } from "@/utils/KatalogCard"; // 1. Impor helper baru

/**
 * Ini adalah komponen halaman utama untuk aplikasi Anda.
 * Sebagai Server Component, ia dapat mengambil data secara langsung.
 */
export default async function Page() {
  // 2. Mengambil semua data yang dibutuhkan secara paralel.
  const [
    minimarketLogoCards, 
    slideshowItems,
    minimarketKatalogCards // Tambahkan variabel untuk data katalog
  ] = await Promise.all([
    getLogoCards("Minimarket"),
    getSlideshowItems(),
    // Panggil helper katalog dengan UUID kategori Minimarket
    getKatalogCards("4b53f953-2657-400d-a68f-dc49a373948f"), 
  ]);

  // 3. Merender komponen HomePage dan meneruskan semua data sebagai props.
  return (
    <HomePage
      slideshowItems={slideshowItems}
      minimarketLogoCards={minimarketLogoCards}
      minimarketKatalogCards={minimarketKatalogCards} // Teruskan prop baru
    />
  );
}
