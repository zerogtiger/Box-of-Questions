import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";

// TO BE CHANGED
export const metadata: Metadata = {
  title: "提问の箱子",
  // description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
