import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Geist Sans
const geistSans = localFont({
  src: [
    {
      path: "src/app/fonts/GeistSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

// Geist Mono
const geistMono = localFont({
  src: [
    {
      path: "src/app/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SilentNode Voting",
  description: "Fully Homomorphic Encrypted Voting dApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

