import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";
import React from "react";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--work-sans" });

export const metadata: Metadata = {
  title: "Figma clone",
  description: "A minimalist Figma clone using Fabris.js and Liveblocks for real-time collaboration.",
  weight: ['400', '600', '700']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${workSans.className} bg-primary-grey-200`}><Room>{children}</Room></body>
    </html>
  );
}
