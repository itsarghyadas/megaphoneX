import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SiteNav from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const bricolageGrotesque = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
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
        <body className={bricolageGrotesque.className}>
          <SiteNav />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
