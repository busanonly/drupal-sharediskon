// app/[...slug]/page.tsx

console.log("DEBUG: app/[...slug]/page.tsx is being processed.");

import KatalogDetail from "@/components/KatalogDetail";
import { getKatalogDetailBySlug } from "@/utils/KatalogCard";
import { notFound } from "next/navigation"; // Ini adalah import yang menyebabkan error "Cannot find module"
import { drupal } from "@/lib/drupal";

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
 * Komponen halaman dinamis untuk menampilkan detail katalog promosi.
 * Mengambil slug dari parameter URL dan memuat data katalog yang sesuai.
 */
export default async function KatalogDetailPage({ params }: KatalogDetailPageProps) {
  const resolvedParams = await params; 
  console.log("KatalogDetailPage - Received params:", resolvedParams);
  
  const slugPath = `/${resolvedParams.slug.join('/')}`;

  console.log("KatalogDetailPage - Constructed slugPath:", slugPath);

  const katalog = await getKatalogDetailBySlug(slugPath);

  // Jika katalog tidak ditemukan, tampilkan halaman 404
  if (!katalog) {
    notFound();
  }

  // PERBAIKAN DI SINI: Type assertion untuk memberi tahu TypeScript bahwa katalog bukan null setelah pengecekan.
  // Ini mengatasi error "Type 'KatalogCard | null' is not assignable to type 'KatalogCard'."
  console.log("KatalogDetailPage - Katalog data received:", katalog.title); // Katalog dijamin tidak null di sini

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
          "page[limit]": 100,
        },
      }
    );

    console.log(`generateStaticParams - Found ${katalogNodes.length} katalog nodes.`);

    const params = katalogNodes
      // PERBAIKAN DI SINI: Memberikan tipe eksplisit pada parameter 'node'
      .map((node: MinimalKatalogNode) => { 
        if (node.path && typeof node.path.alias === 'string' && node.path.alias.length > 0) {
          const slugArray = node.path.alias.substring(1).split('/');
          return { slug: slugArray };
        }
        return null;
      })
      // PERBAIKAN DI SINI: Memberikan tipe eksplisit pada parameter 'param'
      .filter((param: { slug: string[] } | null) => param !== null); 

    console.log("generateStaticParams - Generated static params:", params);
    return params;

  } catch (error) {
    console.error("generateStaticParams - Error generating static params for katalog promosi:", error);
    return [];
  }
}
