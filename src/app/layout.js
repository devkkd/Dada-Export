import "./globals.css";

export const metadata = {
  title: 'Dada Exports - Premium Garment Manufacturer & Exporter from Pushkar',
  description: '38+ years of export-quality apparel manufacturing. Family-backed garment exporter from Pushkar, Rajasthan.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}