import type { Metadata } from "next";
import { Roboto_Flex, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { NotificationBar } from "@/components/layout/notification-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { CookieConsent } from "@/components/layout/cookie-consent";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kenya Airways | The Pride of Africa",
  description: "Book your flights, manage your travel, and explore destinations with Kenya Airways.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(robotoFlex.variable, playfairDisplay.variable)}>
      <body className="antialiased min-h-screen flex flex-col relative font-sans bg-white">
        <NotificationBar />
        <Header />
        
        <main className="flex-1 bg-white">
          {children}
        </main>
        
        <Footer />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
