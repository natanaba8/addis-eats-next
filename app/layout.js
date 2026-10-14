import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./components/Providers";
import Navigation from "./components/Navigation";
import { siteUrl, siteUrlForPath } from "./lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Addis Eats | Ethiopian food made for sharing",
    template: "%s | Addis Eats",
  },
  description:
    "Explore Ethiopian favorites, find a dish to share, and order a freshly prepared meal from Addis Eats.",
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    title: "Addis Eats | Ethiopian food made for sharing",
    description:
      "Explore Ethiopian favorites, find a dish to share, and order a freshly prepared meal from Addis Eats.",
    images: [
      {
        url: siteUrlForPath("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian restaurant",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <div className="site-shell">
            <header className="site-header">
              <Navigation />
            </header>

            {children}

            <footer className="site-footer">
              <p>{new Date().getFullYear()} Addis Eats</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
