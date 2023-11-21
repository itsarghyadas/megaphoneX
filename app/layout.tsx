import "./globals.css";
import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SiteNav from "@/components/navbar";
import { Toaster } from "sonner";
import TanStackProvider from "@/providers/tanstackprovider";

const gabarito = Gabarito({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",
  title: "megaphoneX",
  description: "Your own retweet bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={gabarito.className}>
          <TanStackProvider>
            <SiteNav />
            {children}
            <Toaster richColors />
          </TanStackProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
