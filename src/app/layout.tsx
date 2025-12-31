import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased bg-white`}>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
