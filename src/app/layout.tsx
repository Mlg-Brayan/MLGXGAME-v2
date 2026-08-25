import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MenuProvider } from '@/context/MenuContext';
import SidePanel from '@/components/SidePanel';
import SideNav from '@/components/SideNav';
import BottomNav from '@/components/BottomNav';
import { ChatProvider } from '@/context/ChatContext';
import ChatWidget from '@/components/ChatWidget';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://MLGxGame-v2.vercel.app'),
  title: {
    default: 'MLGxGame - Catalogue Jeux, Applications & Templates Gaming',
    template: '%s | MLGxGame',
  },
  description: 'Découvre des jeux PC, mobile et en ligne, des applications gaming, des templates web et une boutique dédiée aux gamers.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MLGxGame',
    title: 'MLGxGame - Catalogue Jeux, Applications & Templates Gaming',
    description: 'Découvre des jeux PC, mobile et en ligne, des applications gaming, des templates web et une boutique dédiée aux gamers.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
       <MenuProvider>
         <ChatProvider>
           <SideNav />
           {children}
           <BottomNav />
           <SidePanel />
           <ChatWidget />
         </ChatProvider>
        </MenuProvider>
      </body>
    </html>
  );
}