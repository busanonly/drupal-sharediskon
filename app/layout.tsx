// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import { getMainMenuLinks } from "@/utils/Menu";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteInfo } from "@/utils/SiteInfo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuLinks = await getMainMenuLinks();
  const siteInfo = await getSiteInfo();

  const metadata: Metadata = {
    title: siteInfo?.title || "Sharediskon App",
    description: siteInfo?.description || "Aplikasi untuk menemukan promo dan diskon.",
    keywords: siteInfo?.keywords ? siteInfo.keywords.split(',').map(keyword => keyword.trim()) : undefined,
  };

  return (
    // Pastikan tidak ada spasi atau baris kosong di antara <html>, <head>, dan <body>
    <html lang="id" suppressHydrationWarning>
      <head>
        <title>{metadata.title as string}</title>
        {metadata.description && <meta name="description" content={metadata.description as string} />}
        {metadata.keywords && <meta name="keywords" content={(metadata.keywords as string[]).join(',')} />}
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header menuLinks={menuLinks} />
          <main className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
