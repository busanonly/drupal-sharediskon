// components/Header.tsx

"use client";

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MenuItem } from '../utils/Menu'

interface HeaderProps {
  menuLinks: MenuItem[]
}

const Header = ({ menuLinks }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Bagian Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* FIX: Menggunakan 'fill' dengan container berukuran untuk solusi yang lebih andal */}
            <div className="relative w-[180px] h-[40px]">
              <Image
                src="/logosharediskon.svg"
                alt="Logo Sharediskon"
                fill
                priority
                className="object-contain" // Menjaga rasio aspek di dalam container
              />
            </div>
          </Link>

          {/* Bagian Navigasi */}
          <div className="flex items-center">
            <nav className="hidden md:flex md:items-center md:space-x-8">
              {menuLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
            
            {/* Tombol Hamburger */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Buka menu utama</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
