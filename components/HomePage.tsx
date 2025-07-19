// components/HomePage.tsx

import Image from 'next/image';
import { LogoCard } from '@/utils/LogoCard';
import { Slide } from '@/utils/Slideshow';
import { KatalogCard as KatalogCardType } from '@/utils/KatalogCard';
import Slideshow from './Slideshow';
import KatalogCard from './KatalogCard'; 

interface HomePageProps {
  slideshowItems: Slide[];
  minimarketLogoCards: LogoCard[];
  minimarketKatalogCards: KatalogCardType[];
}

const HomePage = ({ slideshowItems, minimarketLogoCards, minimarketKatalogCards }: HomePageProps) => {
  return (
    <>
      <section className="mb-12">
        {Array.isArray(slideshowItems) && <Slideshow slides={slideshowItems} />}
      </section>

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
          {/* PERUBAHAN DI SINI: md:grid-cols-6 */}
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {minimarketKatalogCards.map((katalog) => (
              <KatalogCard key={katalog.id} katalog={katalog} />
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
    </>
  );
};

export default HomePage;