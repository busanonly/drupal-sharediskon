// app/[...slug]/page.tsx

console.log("DEBUG: app/[...slug]/page.tsx is being processed.");

import KatalogDetail from "@/components/KatalogDetail";
import { getKatalogDetailBySlug } from "@/utils/KatalogCard";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";

/**
 * Komponen halaman dinamis untuk menampilkan detail katalog promosi.
 * Mengambil slug dari parameter URL dan memuat data katalog yang sesuai.
 */
export default async function KatalogDetailPage({ params }: { params: { slug: string[] } }) {
  const resolvedParams = await params; 
  console.log("KatalogDetailPage - Received params:", resolvedParams);
  
  const slugPath = `/${resolvedParams.slug.join('/')}`;

  console.log("KatalogDetailPage - Constructed slugPath:", slugPath);

  const katalog = await getKatalogDetailBySlug(slugPath);

  console.log("KatalogDetailPage - Katalog data received:", katalog ? katalog.title : "Not found");

  if (!katalog) {
    notFound();
  }

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
    const katalogNodes = await drupal.getResourceCollection<any[]>(
      "node--katalog_promosi",
      {
        params: {
          "fields[node--katalog_promosi]": "path",
          "filter[status]": 1,
          "page[limit]": 100,
        },
      }
    );

    console.log(`generateStaticParams - Found ${katalogNodes.length} katalog nodes.`);

    const params = katalogNodes
      .map(node => {
        if (node.path && typeof node.path.alias === 'string' && node.path.alias.length > 0) {
          const slugArray = node.path.alias.substring(1).split('/');
          return { slug: slugArray };
        }
        return null;
      })
      .filter(param => param !== null);

    console.log("generateStaticParams - Generated static params:", params);
    return params;

  } catch (error) {
    console.error("generateStaticParams - Error generating static params for katalog promosi:", error);
    return [];
  }
}