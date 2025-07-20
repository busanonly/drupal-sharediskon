// app/page.tsx

import HomePage from "@/components/HomePage";
import { getLogoCards } from "@/utils/LogoCard"; // Pastikan ini diimpor
import { getSlideshowItems } from "@/utils/Slideshow";
import { getKatalogCards } from "@/utils/KatalogCard";
import { getSiteInfo, SiteInfo } from "@/utils/SiteInfo";

/**
 * Ini adalah komponen halaman utama untuk aplikasi Anda.
 * Sebagai Server Component, ia dapat mengambil data secara langsung.
 */
export default async function Page() {
  const [
    minimarketLogoCards, 
    supermarketLogoCards, // Logo Cards untuk section pertama Supermarket (jika ada)
    slideshowItems,
    minimarketKatalogCards,
    supermarketLogoCardsBelowKatalog, // <<< PERUBAHAN DI SINI: Variabel baru untuk Logo Cards di bawah Katalog
    siteInfo,
  ] = await Promise.all([
    getLogoCards("Minimarket"),
    getLogoCards("Supermarket"), // Logo Cards untuk section pertama Supermarket
    getSlideshowItems(),
    getKatalogCards("4b53f953-2657-400d-a68f-dc49a373948f"), // UUID untuk kategori Minimarket Katalog
    // <<< PERUBAHAN DI SINI: Mengubah getKatalogCards menjadi getLogoCards >>>
    // Mengambil Logo Card untuk kategori 'Supermarket' di posisi ini.
    // PENTING: Ganti 'Supermarket' dengan nama kategori yang tepat jika berbeda.
    getLogoCards("Supermarket"), 
    getSiteInfo(),
  ]);

  return (
    <HomePage
      slideshowItems={slideshowItems}
      minimarketLogoCards={minimarketLogoCards}
      supermarketLogoCards={supermarketLogoCards} // Meneruskan Logo Cards pertama Supermarket
      minimarketKatalogCards={minimarketKatalogCards}
      supermarketLogoCardsBelowKatalog={supermarketLogoCardsBelowKatalog} // <<< TERUSKAN PROP BARU
      siteInfo={siteInfo}
    />
  );
}
