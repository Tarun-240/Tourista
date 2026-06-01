import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tourista | Premium AI Travel Planner",
  description: "Modern travel-tech SaaS application for planning luxury and curated trips with AI.",
  keywords: ["travel", "AI planner", "itinerary", "vacation", "Tourista", "smart travel"],
  openGraph: {
    title: "Tourista | Premium AI Travel Planner",
    description: "Modern travel-tech SaaS application for planning luxury and curated trips with AI.",
    url: "https://tourista.ai",
    siteName: "Tourista",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tourista | Premium AI Travel Planner",
    description: "Modern travel-tech SaaS application for planning luxury and curated trips with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
