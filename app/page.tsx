// app/page.tsx

import HomePage from "@/components/HomePage";
import { getLogoCards } from "@/utils/LogoCard"; 
import { getSlideshowItems } from "@/utils/Slideshow";
import { getKatalogCards } from "@/utils/KatalogCard";
import { getSiteInfo, SiteInfo } from "@/utils/SiteInfo";

/**
 * Ini adalah komponen halaman utama untuk aplikasi Anda.
 * Sebagai Server Component, ia dapat mengambil data secara langsung.
 */
export default async function Page() {
  // UUID untuk kategori Minimarket (sudah dikonfirmasi)
  const MINIMARKET_CATEGORY_UUID = "4b53f953-2657-400d-a68f-dc49a373948f";
  // UUID yang benar untuk kategori Supermarket (berdasarkan drupal_internal__target_id: 18)
  const SUPERMARKET_CATEGORY_UUID = "f6b60dc4-149b-4bc0-950d-b49bd4fd089f"; 

  const [
    minimarketLogoCards, 
    supermarketLogoCards, 
    slideshowItems,
    minimarketKatalogCards,
    supermarketLogoCardsBelowKatalog, 
    supermarketKatalogCards, 
    siteInfo,
  ] = await Promise.all([
    getLogoCards("Minimarket"),
    getLogoCards("Supermarket"), 
    getSlideshowItems(),
    getKatalogCards(MINIMARKET_CATEGORY_UUID), // Menggunakan UUID Minimarket
    getLogoCards("Supermarket"), 
    getKatalogCards(SUPERMARKET_CATEGORY_UUID), // <<< MENGGUNAKAN UUID SUPERMARKET YANG BENAR DI SINI
    getSiteInfo(),
  ]);

  return (
    <HomePage
      slideshowItems={slideshowItems}
      minimarketLogoCards={minimarketLogoCards}
      supermarketLogoCards={supermarketLogoCards} 
      minimarketKatalogCards={minimarketKatalogCards}
      supermarketLogoCardsBelowKatalog={supermarketLogoCardsBelowKatalog} 
      supermarketKatalogCards={supermarketKatalogCards} 
      siteInfo={siteInfo}
    />
  );
}
