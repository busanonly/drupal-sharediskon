// components/KatalogDetail.tsx

"use client"; // Menggunakan Client Component karena ada interaktivitas (state, event listeners)

import Image from 'next/image';
import { KatalogCard } from '@/utils/KatalogCard'; // Mengimpor tipe KatalogCard yang baru
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Mengimpor hooks useState dan useEffect

/**
 * Mendefinisikan props yang akan diterima oleh komponen KatalogDetail.
 */
interface KatalogDetailProps {
  katalog: KatalogCard; // Data detail katalog
}

/**
 * Komponen KatalogDetail untuk menampilkan detail lengkap satu item katalog promosi.
 * @param {KatalogDetailProps} { katalog } - Props yang berisi data detail katalog.
 */
const KatalogDetail = ({ katalog }: KatalogDetailProps) => {
  // State untuk mengelola indeks gambar yang sedang aktif di carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State untuk mengelola visibilitas pop-up (lightbox)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fungsi helper untuk memformat sisa waktu
  const formatRemainingTime = (endDateString: string): string => {
    const now = new Date();
    const end = new Date(endDateString);

    if (now > end) {
      return "Sudah berakhir";
    }

    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
      return `Berakhir ${diffMonths} bulan lagi`;
    }
    if (diffDays > 0) {
      return `Berakhir ${diffDays} hari lagi`;
    }
    if (diffHours > 0) {
      return `Berakhir ${diffHours} jam lagi`;
    }

    if (diffMs > 0) {
      return "Berakhir kurang dari 1 jam lagi";
    }

    return "Sudah berakhir";
  };

  const remainingTime = formatRemainingTime(katalog.endDate);

  // Fungsi untuk maju ke gambar berikutnya di carousel
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % katalog.images.length
    );
  };

  // Fungsi untuk mundur ke gambar sebelumnya di carousel
  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + katalog.images.length) % katalog.images.length
    );
  };

  // Mendapatkan URL gambar utama untuk carousel (prioritas: large, fallback: original)
  const mainImage = katalog.images[currentImageIndex];
  const mainImageUrl = mainImage?.urls.large || mainImage?.urls.original;
  // Mendapatkan URL gambar untuk lightbox (prioritas: wide, fallback: original)
  const lightboxImageUrl = mainImage?.urls.wide || mainImage?.urls.original;

  // Jika tidak ada gambar sama sekali, mungkin tampilkan pesan atau redirect
  if (!katalog.images || katalog.images.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-4xl mx-auto">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada gambar untuk katalog ini.</p>
        <Link href="/" className="inline-flex items-center px-6 py-3 mt-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Bagian Carousel Gambar Utama */}
      <div className="relative w-full h-96 sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center bg-gray-200 dark:bg-gray-700">
        {mainImageUrl ? (
          <>
            <Image
              src={mainImageUrl}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain cursor-pointer"
              unoptimized
              onClick={() => setIsLightboxOpen(true)}
            />
            {/* Tombol Navigasi Carousel */}
            {katalog.images.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors duration-200 z-10"
                  aria-label="Previous image"
                >
                  &lt;
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75 transition-colors duration-200 z-10"
                  aria-label="Next image"
                >
                  &gt;
                </button>
              </>
            )}
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Gambar utama tidak tersedia.</p>
        )}
      </div>

      {/* Thumbnail Navigasi Carousel */}
      {katalog.images.length > 1 && (
        <div className="flex justify-center gap-2 p-4 bg-gray-100 dark:bg-gray-700 overflow-x-auto">
          {katalog.images.map((img, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                index === currentImageIndex ? 'border-indigo-500' : 'border-transparent'
              } hover:border-indigo-400 transition-colors duration-200 flex-shrink-0`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                src={img.urls.thumbnail || img.urls.original}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Bagian Konten Detail */}
      <div className="p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {katalog.title}
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <span className="mr-4">
            Kategori: <span className="font-semibold">{katalog.storeCategory}</span>
          </span>
          <span>
            Status: <span className={`font-semibold ${remainingTime === 'Sudah berakhir' ? 'text-red-500' : 'text-green-500'}`}>
              {remainingTime}
            </span>
          </span>
        </div>

        {/* Tanggal Mulai dan Berakhir */}
        <div className="text-gray-700 dark:text-gray-300 text-sm mb-6">
          <p>Mulai: {new Date(katalog.startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Berakhir: {new Date(katalog.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Konten Body (deskripsi promo) */}
        {katalog.body && (
          // PASTIKAN KELAS 'prose' ADA DI SINI
          <div 
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200" 
            dangerouslySetInnerHTML={{ __html: katalog.body }} 
          />
        )}

        {/* Tombol Kembali */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Lightbox Pop-up */}
      {isLightboxOpen && lightboxImageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImageUrl}
              alt={mainImage.alt}
              width={1200}
              height={900}
              className="object-contain max-w-full max-h-[90vh]"
              unoptimized
            />
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none hover:bg-opacity-75 transition-colors duration-200"
              aria-label="Close lightbox"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KatalogDetail;
