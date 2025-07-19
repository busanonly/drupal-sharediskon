import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class", 
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // PERUBAHAN DI SINI: Menyesuaikan gaya untuk konten 'prose'
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            p: {
              // Meningkatkan margin-bottom dan margin-top untuk paragraf
              // Kita coba nilai yang lebih besar (2.5em) agar lebih terlihat perbedaannya
              marginBottom: '2.5em', 
              marginTop: '2.5em', 
            },
            // Anda juga bisa menyesuaikan elemen lain jika perlu, misalnya:
            // 'h1, h2, h3, h4, h5, h6': {
            //   marginTop: '2em',
            //   marginBottom: '1em',
            // },
            // ul: {
            //   marginTop: '1em',
            //   marginBottom: '1em',
            // },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
