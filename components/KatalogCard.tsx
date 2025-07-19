// components/KatalogCard.tsx

"use client";

import Image from 'next/image';
import { KatalogCard as KatalogCardType } from '@/utils/KatalogCard'; // Mengimpor tipe data KatalogCard yang sudah diupdate
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

interface KatalogCardProps {
  katalog: KatalogCardType;
}

const KatalogCard = ({ katalog }: KatalogCardProps) => {
  const [remainingTime, setRemainingTime] = useState(formatRemainingTime(katalog.endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(formatRemainingTime(katalog.endDate));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [katalog.endDate]);

  // Mendapatkan gambar pertama dari array images untuk ditampilkan di kartu
  const mainImage = katalog.images[0]; 
  // Jika tidak ada gambar, mungkin tampilkan placeholder atau lewati rendering kartu
  if (!mainImage) {
    console.warn("KatalogCard: No main image found for katalog:", katalog.id);
    return null; // Atau tampilkan placeholder div
  }

  return (
    <Link href={katalog.slug} passHref>
      <div className="group relative overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl bg-white dark:bg-gray-800 flex flex-col cursor-pointer">
        <div className="relative w-full" style={{ paddingBottom: '125%' }}>
          <Image
            // PERUBAHAN DI SINI: Menggunakan mainImage.urls.medium atau fallback ke .original
            src={mainImage.urls.medium || mainImage.urls.original} 
            alt={mainImage.alt} // Menggunakan alt teks dari objek gambar
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base line-clamp-2 mb-1" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
            {katalog.title}
          </h3>
          <p className={`text-xs ${remainingTime === 'Sudah berakhir' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {remainingTime}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default KatalogCard;
