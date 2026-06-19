import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rowconno",
  description: "Security researcher. CTF player. Writeups and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-200 antialiased">
        <NavBar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-6">
          <p className="text-center font-mono text-xs text-zinc-600">
            rowconno &mdash; built with Next.js
          </p>
        </footer>
      </body>
    </html>
  );
}
