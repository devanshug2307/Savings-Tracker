import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Savings Tracker - Save Money Challenge",
  description:
    "Track your savings goals and complete money-saving challenges with our interactive savings tracker.",
  keywords:
    "savings tracker, money saving challenge, financial goals, saving money, personal finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-pink-50">{children}</main>
      </body>
    </html>
  );
}
