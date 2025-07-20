// app/[...slug]/page.tsx

console.log("DEBUG: app/[...slug]/page.tsx is being processed.");

import KatalogDetail from "@/components/KatalogDetail";
import { getKatalogDetailBySlug } from "@/utils/KatalogCard";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";
import type { Metadata } from "next";
import { fetchWithRetry } from "@/utils/KatalogCard"; // <<< PERBAIKAN DI SINI: IMPORT fetchWithRetry

/**
 * Mendefinisikan tipe minimal untuk node katalog yang hanya berisi path.
 */
interface MinimalKatalogNode {
  path: {
    alias: string;
  };
  status: boolean;
}

// Antarmuka untuk respons koleksi dari Drupal dengan properti 'links' untuk paginasi.
interface DrupalCollectionWithLinks<T> extends Array<T> {
  links?: {
    next?: {
      href: string;
    };
  };
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
    console.log("generateStaticParams - Starting to fetch ALL katalog nodes for slugs...");
    let allKatalogNodes: MinimalKatalogNode[] = [];
    let nextUrl: string | null = null;
    let page = 0;

    do {
      // Menggunakan fetchWithRetry untuk pengambilan koleksi sumber daya
      const response: DrupalCollectionWithLinks<MinimalKatalogNode> = await fetchWithRetry(async () => {
        return await drupal.getResourceCollection<DrupalCollectionWithLinks<MinimalKatalogNode>>(
          "node--katalog_promosi",
          {
            params: {
              "fields[node--katalog_promosi]": "path,status",
              "filter[status]": 1, 
            },
            ...(nextUrl && { path: nextUrl.replace(drupal.baseUrl, "") }),
          }
        );
      }, 5, 3000); // Coba 5 kali, mulai dengan delay 3 detik (3000ms)

      if (!response || response.length === 0) {
        console.log(`generateStaticParams - No more nodes found after page ${page}.`);
        break;
      }

      allKatalogNodes = allKatalogNodes.concat(response);
      
      nextUrl = response.links?.next?.href || null;
      page++;
      console.log(`generateStaticParams - Fetched page ${page}, total nodes so far: ${allKatalogNodes.length}. Next URL: ${nextUrl || 'none'}`);

    } while (nextUrl);

    console.log(`generateStaticParams - Found a total of ${allKatalogNodes.length} katalog nodes across all pages.`);

    const params = allKatalogNodes
      .map((node: MinimalKatalogNode) => {
        if (node.path && typeof node.path.alias === 'string' && node.path.alias.length > 0) {
          const slugArray = node.path.alias.substring(1).split('/');
          return { slug: slugArray };
        }
        return null;
      })
      .filter((param: { slug: string[] } | null) => param !== null);

    console.log(`generateStaticParams - Generated ${params.length} static params.`);
    console.log("generateStaticParams - Generated static params (sample):", params.slice(0, 5));

    return params;
  } catch (error) {
    console.error("generateStaticParams - Error generating static params for katalog promosi:", error);
    return [];
  }
}

export const dynamicParams = true;
