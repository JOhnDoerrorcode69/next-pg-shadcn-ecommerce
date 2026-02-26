import type { AppProps } from "next/app";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/shared/footer";
import { SessionProvider } from "next-auth/react";
import { Poppins as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }
      `}</style>
      <div className={`flex min-h-screen flex-col bg-[#eef3ee] ${fontSans.variable} font-sans`}>
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}
