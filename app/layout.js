import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import SiteLayout from "./components/site-layout";

import "./css/card.scss";
import "./css/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portfolio of Tushar Nama - Web Developer",
  description:
    "This is the portfolio of Tushar Nama. I am a full stack developer and a self taught developer. I love to learn new things and I am always open to collaborating with others. I am a quick learner and I am always looking for new challenges.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />

        <SiteLayout>
          {children}
        </SiteLayout>
      </body>

      <GoogleTagManager
        gtmId={process.env.NEXT_PUBLIC_GTM}
      />
    </html>
  );
}