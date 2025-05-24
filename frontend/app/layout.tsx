import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; 
import "./globals.css";
import { Providers } from "./providers";
import FloatingProfile from "@/components/FloatingProfile";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RateMyStore",
  description: "A platform to rate and review stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <FloatingProfile />
        </Providers>
      </body>
    </html>
  );
}
