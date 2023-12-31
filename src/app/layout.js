import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next Voting App by devpandaz",
  description:
    "Inspired by the Django Voting App tutorial, but better, with NextJS. ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
        <Providers>
          <div>
            <Header />
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
