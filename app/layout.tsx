import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/ui/notification-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Posts App",
  description: "A simple application to manage posts",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NotificationProvider>
          <div className="min-h-screen">{children}</div>
        </NotificationProvider>
      </body>
    </html>
  );
}

