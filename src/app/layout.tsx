import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Renters | Contratos de Arrendamiento Legales",
  description: "Genera tu contrato de arrendamiento personalizado y legalmente válido para Nuevo León. Basado en el Código Civil estatal. Listo para firmar en minutos. $499 MXN.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://contratos.renters.mx'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: 'Renters — Contratos de Arrendamiento',
    title: 'Contratos de Arrendamiento Legales | Renters.mx',
    description: 'Contrato personalizado por estado mexicano. Listo para firmar. $499 MXN.',
    images: [{ url: '/images/hero-bg.png', width: 1200, height: 630, alt: 'Renters Contratos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contratos de Arrendamiento Legales | Renters.mx',
    description: 'Contrato personalizado por estado mexicano. Listo para firmar. $499 MXN.',
    images: ['/images/hero-bg.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-clean text-text-main font-sans">
        <Navbar />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

