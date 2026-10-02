import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ELITE ACADEMY | a division of ZHONNEX CORP",
  description: "YOUR VISION. OUR ARCHITECTURE. — The Elite Tech Academy & Solutions Marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050508] text-white min-h-screen antialiased selection:bg-white selection:text-black">
        <div className="fixed inset-0 -z-10 glow pointer-events-none" />
        <div className="fixed inset-0 -z-10 bg-[#050508]" />
        {children}
      </body>
    </html>
  );
}
