import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Django Voting App",
  description:
    "The django tutorial, the django voting app, but it's django + nextjs",
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
        </Providers>
      </body>
    </html>
  );
}

export const dynamicParams = false;
