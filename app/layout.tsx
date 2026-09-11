import {getSite} from "../lib/site";
import SiteProvider from "./site-provider";
import type { Metadata } from "next";
import "./globals.css";
import PWA from "./pwa";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://hallbiblecommentary.vercel.app"),
  manifest:"/manifest.webmanifest",
  appleWebApp:{capable:true,statusBarStyle:"default",title:"Hall Bible"},
  openGraph:{title:"Hall Bible Commentary",description:"The World English Bible and Aaron Joseph Hall’s growing teaching library.",type:"website"},
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
      <body className="antialiased"><SiteProvider value={site}><a href="#main-content" className="skip-link">Skip to content</a><div id="main-content">{children}</div><PWA/></SiteProvider></body>
    </html>
  );
}

export const viewport={themeColor:"#173b65",width:"device-width",initialScale:1};
