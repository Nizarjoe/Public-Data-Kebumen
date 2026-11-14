import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KEBUMEN PADA ANGKA — Public Data Analysis",
  description:
    "Portal data publik Kabupaten Kebumen: 26 kecamatan, 460 desa/kelurahan, indikator resmi Open Data Kebumen. Data serius, tampilan berani.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${archivo.variable} ${space.variable} h-full antialiased`}>
      <body className="noise min-h-full flex flex-col bg-canvas">{children}</body>
    </html>
  );
}
