// components/HomePage.tsx

import Image from 'next/image';
import { LogoCard } from '@/utils/LogoCard'; 
import { Slide } from '@/utils/Slideshow';
import { KatalogCard as KatalogCardType } from '@/utils/KatalogCard';
import { SiteInfo } from '@/utils/SiteInfo';
import Slideshow from './Slideshow';
import KatalogCard from './KatalogCard';

// Mendefinisikan props yang akan diterima oleh komponen HomePage.
interface HomePageProps {
  slideshowItems: Slide[];
  minimarketLogoCards: LogoCard[];
  supermarketLogoCards: LogoCard[]; // <<< PERBAIKAN DI SINI: TAMBAHKAN PROP INI
  minimarketKatalogCards: KatalogCardType[];
  supermarketLogoCardsBelowKatalog: LogoCard[];
  siteInfo: SiteInfo | null;
}

/**
 * Komponen utama untuk halaman beranda yang menyusun berbagai section.
 */
const HomePage = ({ slideshowItems, minimarketLogoCards, supermarketLogoCards, minimarketKatalogCards, supermarketLogoCardsBelowKatalog, siteInfo }: HomePageProps) => {
  return (
    <>
      {/* Section 1: Slideshow */}
      <section className="mb-12">
        {Array.isArray(slideshowItems) && <Slideshow slides={slideshowItems} />}
      </section>

      {/* Section 2: Sharediskon Minimarket (Logo Cards) */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Sharediskon Minimarket
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Temukan promosi dan diskon eksklusif dari berbagai minimarket favorit Anda.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {Array.isArray(minimarketLogoCards) && minimarketLogoCards.map((logo) => (
              <div
                key={logo.id}
                className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={logo.imageUrl}
                  alt={logo.alt}
                  width={158}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Katalog Promo Minimarket - Mode Swipe */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Katalog Promo Minimarket
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Jangan lewatkan penawaran terbaik dari minimarket terdekat.
          </p>
        </div>
        
        {Array.isArray(minimarketKatalogCards) && minimarketKatalogCards.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
            {minimarketKatalogCards.map((katalog) => (
              <div key={katalog.id} className="flex-shrink-0 w-5/12 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 snap-center pr-4">
                <KatalogCard katalog={katalog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada katalog promosi untuk kategori ini. Silakan cek kembali nanti.
            </p>
          </div>
        )}
      </section>

      {/* SECTION BARU: Sharediskon Supermarket (Logo Cards) - Ini adalah section yang sebelumnya untuk Katalog Promo Supermarket */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Sharediskon Supermarket
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Temukan promosi dan diskon eksklusif dari berbagai supermarket favorit Anda.
            </p>
          </div>
          {/* Menggunakan supermarketLogoCardsBelowKatalog di sini */}
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {Array.isArray(supermarketLogoCardsBelowKatalog) && supermarketLogoCardsBelowKatalog.map((logo) => (
              <div
                key={logo.id}
                className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={logo.imageUrl}
                  alt={logo.alt}
                  width={158}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Katalog Promo Supermarket yang asli (sekarang dihapus atau dikomentari jika tidak diperlukan lagi) */}
      {/* Jika Anda tidak lagi ingin menampilkan Katalog Promo Supermarket, Anda bisa menghapus section ini. */}
      {/* Untuk saat ini, saya akan mengomentarinya agar Anda bisa memutuskan. */}
      {/*
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Katalog Promo Supermarket
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Temukan penawaran spesial dari supermarket favorit Anda.
          </p>
        </div>
        
        {Array.isArray(supermarketKatalogCards) && supermarketKatalogCards.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
            {supermarketKatalogCards.map((katalog) => (
              <div key={katalog.id} className="flex-shrink-0 w-5/12 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 snap-center pr-4">
                <KatalogCard katalog={katalog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada katalog promosi untuk kategori ini. Silakan cek kembali nanti.
            </p>
          </div>
        )}
      </section>
      */}
    </>
  );
};

export default HomePage;
