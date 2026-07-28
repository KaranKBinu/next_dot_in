import type { Metadata } from "next";
import "./globals.css";
import { getCurrentSession } from "@/lib/auth";
import { getSystemSettings } from "@/lib/settings";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NEXT.IN | Architectural Essentials",
  description: "Minimalist fashion and architectural clothing items.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentSession();
  const settings = await getSystemSettings();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#111827] font-sans selection:bg-[#111827] selection:text-white">
        <CartProvider>
          <WishlistProvider>
            <Header user={user} settings={settings} />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
