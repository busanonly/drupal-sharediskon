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
  const [
    minimarketLogoCards, 
    slideshowItems,
    minimarketKatalogCards,
    siteInfo,
  ] = await Promise.all([
    getLogoCards("Minimarket"),
    getSlideshowItems(),
    getKatalogCards("4b53f953-2657-400d-a68f-dc49a373948f"), 
    getSiteInfo(),
  ]);

  return (
    <HomePage
      slideshowItems={slideshowItems}
      minimarketLogoCards={minimarketLogoCards}
      minimarketKatalogCards={minimarketKatalogCards}
      siteInfo={siteInfo}
    />
  );
}