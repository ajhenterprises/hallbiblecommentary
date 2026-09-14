import {socialImage} from '../lib/public-url';
import {getSite} from "../lib/site";
import SiteProvider from "./site-provider";
import type { Metadata } from "next";
import "./globals.css";
import ReadingDisclaimer from './reading-disclaimer';
import PWA from "./pwa";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hallbiblecommentary.com'),
  twitter:{card:"summary_large_image",images:[socialImage("Hall Bible Commentary")]},
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,statusBarStyle:"default",title:"Hall Bible"},
  openGraph:{title:"Hall Bible Commentary",description:"The World English Bible and Aaron Joseph Hall’s growing teaching library.",type:"website",url:"https://www.hallbiblecommentary.com",siteName:"Hall Bible Commentary",images:[socialImage("Hall Bible Commentary")]},
  title: "Hall Bible Commentary",
  description: "Read the World English Bible and explore the personal commentary library of Aaron Joseph Hall.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    apple:"/icon-192.png",
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site=await getSite();
  return (
    <html lang="en">
      <body className="antialiased"><SiteProvider value={site}><a href="#main-content" className="skip-link">Skip to content</a><div id="main-content">{children}</div><PWA/><ReadingDisclaimer/></SiteProvider></body>
    </html>
  );
}

export const viewport={themeColor:"#173b65",width:"device-width",initialScale:1};
