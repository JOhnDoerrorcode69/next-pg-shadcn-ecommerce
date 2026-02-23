import type { AppProps } from "next/app";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps, router }: AppProps) {
  const hideNavbar = router.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

