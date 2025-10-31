import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NextFont } from "next/dist/compiled/@next/font";
import ReduxProvider from "./providers/ReduxProvider";
import { SonnerProvider } from "./providers/SonnerProvider";

const poppins: NextFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Authentication System Demo",
  description: "A secure authentication and authorization demo built with Next.js, TypeScript, and JWT — includes login, registration, and protected routes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}`}
      >
        <ReduxProvider>
          <SonnerProvider>
            {children}
          </SonnerProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
