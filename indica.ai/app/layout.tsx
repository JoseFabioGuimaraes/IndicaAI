import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/authentication/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indica.AI – Avaliações e Recomendações Profissionais",
  description: "Indica.AI conecta profissionais e colaboradores, permitindo que líderes façam comentários e avaliações para destacar habilidades e desempenho no trabalho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            { children }
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
