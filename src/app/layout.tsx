import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/PrivyProvider";
import { Toaster } from "@/components/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Proof of Play - On-Chain Leaderboard",
    template: "%s | Proof of Play",
  },
  description:
    "Proof of Play is an on-chain leaderboard platform where your gaming achievements are minted as NFTs. Log in with your Ethereum wallet or email, play fun mini-games, and rise up the ranks. Every score is verifiable, transparent, and earned on chain.",
  twitter: {
    card: "summary_large_image",
    title: "Proof of Play - On-Chain Leaderboard",
    description:
      "Earn NFT trophies by playing mini-games and climbing the on-chain leaderboard. Log in with your wallet or email to get started!",
    creator: "@Anirban1627506",
  },
  icons: {
    icon: "/favicon.ico",
    other: [
      { rel: "mask-icon", url: "/trophy.svg", color: "#A1C4FD" },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
