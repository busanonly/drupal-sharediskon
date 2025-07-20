// app/[...slug]/page.tsx

console.log("DEBUG: app/[...slug]/page.tsx is being processed.");

import KatalogDetail from "@/components/KatalogDetail";
import { getKatalogDetailBySlug } from "@/utils/KatalogCard";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";
import type { Metadata } from "next";

/**
 * Mendefinisikan tipe minimal untuk node katalog yang hanya berisi path.
 */
interface MinimalKatalogNode {
  path: {
    alias: string;
  };
  status: boolean;
}

// Mendefinisikan tipe PageProps secara eksplisit untuk menangani params sebagai Promise
interface KatalogDetailPageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Fungsi generateMetadata untuk mengatur metadata halaman secara dinamis.
 * Ini akan mengambil judul dari node katalog dan menggunakannya sebagai judul halaman.
 */
export async function generateMetadata({ params }: KatalogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = `/${resolvedParams.slug.join('/')}`;
  const katalog = await getKatalogDetailBySlug(slugPath);

  if (!katalog) {
    return {
      title: "Katalog Tidak Ditemukan | sharediskon.com",
    };
  }

  return {
    title: `${katalog.title} | sharediskon.com`, 
  };
}


/**
 * Komponen halaman dinamis untuk menampilkan detail katalog promosi.
 * Mengambil slug dari parameter URL dan memuat data katalog yang sesuai.
 */
export default async function KatalogDetailPage({ params }: KatalogDetailPageProps) {
  const resolvedParams = await params;
  console.log("KatalogDetailPage - Received params:", resolvedParams);
  
  const slugPath = `/${resolvedParams.slug.join('/')}`;

  console.log("KatalogDetailPage - Constructed slugPath:", slugPath);

  const katalog = await getKatalogDetailBySlug(slugPath);

  console.log("KatalogDetailPage - Katalog data received:", katalog ? katalog.title : "Not found");

  if (!katalog) {
    notFound();
  }

  console.log("KatalogDetailPage - Katalog data received:", katalog.title);

  return (
    <KatalogDetail katalog={katalog} />
  );
}

/**
 * Fungsi generateStaticParams memberi tahu Next.js slug mana yang harus di-generate
 * sebagai halaman statis saat build time.
 * Ini sangat penting untuk rute dinamis.
 */
export async function generateStaticParams() {
  try {
    console.log("generateStaticParams - Starting to fetch all katalog nodes for slugs...");
    const katalogNodes = await drupal.getResourceCollection<MinimalKatalogNode[]>(
      "node--katalog_promosi",
      {
        params: {
          "fields[node--katalog_promosi]": "path,status",
          "filter[status]": 1, 
          // <<< PERUBAHAN DI SINI: Hapus "page[limit]": 100,
          // Ini akan mengambil semua node yang dipublikasikan.
        },
      }
    );

    console.log(`generateStaticParams - Found ${katalogNodes.length} katalog nodes.`);

    const params = katalogNodes
      .map((node: MinimalKatalogNode) => {
        if (node.path && typeof node.path.alias === 'string' && node.path.alias.length > 0) {
          const slugArray = node.path.alias.substring(1).split('/');
          return { slug: slugArray };
        }
        return null;
      })
      .filter((param: { slug: string[] } | null) => param !== null);

    console.log("generateStaticParams - Generated static params:", params);
    return params;

  } catch (error) {
    console.error("generateStaticParams - Error generating static params for katalog promosi:", error);
    return [];
  }
}
