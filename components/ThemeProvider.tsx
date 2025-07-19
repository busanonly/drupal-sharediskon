// components/ThemeProvider.tsx

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// FIX: Mengubah path impor untuk ThemeProviderProps
import { type ThemeProviderProps } from "next-themes";

/**
 * Komponen ini membungkus aplikasi dengan ThemeProvider dari next-themes.
 * Ini memungkinkan seluruh aplikasi untuk mengakses dan mengubah tema.
 * @param {ThemeProviderProps} { children, ...props }
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
