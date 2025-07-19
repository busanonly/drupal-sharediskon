// lib/drupal.ts

import { DrupalClient } from "next-drupal"

// Memeriksa apakah variabel lingkungan DRUPAL_BASE_URL sudah diatur.
// Jika tidak, akan muncul error untuk memberitahu pengguna.
if (!process.env.DRUPAL_BASE_URL) {
  throw new Error("DRUPAL_BASE_URL environment variable is not set.")
}

// Membuat instance baru dari DrupalClient.
// Klien ini akan digunakan untuk berinteraksi dengan Drupal API Anda.
export const drupal = new DrupalClient(
  process.env.DRUPAL_BASE_URL, // URL dasar dari situs Drupal Anda.
  {
    // Opsi untuk permintaan fetch.
    // Menambahkan tipe eksplisit untuk 'url' dan 'options' untuk mengatasi error TypeScript (ts7006).
    fetcher: (url: string, options?: RequestInit) => {
      // Selalu tambahkan header otentikasi ke setiap permintaan.
      const headers = new Headers(options?.headers)
      headers.append(
        "Authorization",
        "Basic " +
          Buffer.from(
            `${process.env.DRUPAL_API_USERNAME}:${process.env.DRUPAL_API_PASSWORD}`
          ).toString("base64")
      )

      // Melakukan permintaan fetch dengan header yang sudah ditambahkan.
      return fetch(url, {
        ...options,
        headers,
      })
    },
    // Mengaktifkan mode debug untuk menampilkan informasi tambahan saat development.
    // Sebaiknya diatur ke `false` di lingkungan produksi.
    debug: process.env.NODE_ENV === "development",
  }
)
