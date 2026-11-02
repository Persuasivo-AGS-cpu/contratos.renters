import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Analytics } from "@/components/layout/Analytics";
import { AttributionCapture } from "@/components/layout/AttributionCapture";
import { getAvailableStatesList } from "@/lib/states";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contratos de Arrendamiento Legales por Estado — desde $499 | Renters",
  description: `Genera tu contrato de arrendamiento personalizado para ${getAvailableStatesList()}. Plantilla basada en el Código Civil de cada estado. Revísalo antes de pagar y descárgalo en PDF para firmar. $499 MXN.`,
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-clean text-text-main font-sans">
        <Navbar />
        {children}
        <AttributionCapture />
        <Analytics />
      </body>
    </html>
  );
}

