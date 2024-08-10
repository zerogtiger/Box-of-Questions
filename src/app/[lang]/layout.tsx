import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/footer";
import { getDictionary } from "./dictionaries";
import DictionaryProvider from "./dictionaryProvider";

export const metadata: Metadata = {
  title: "提问の箱子",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: { lang: string }
}>) {
  const dictionary = await getDictionary(params.lang)

  return (
    <html lang={params.lang}>
      <body>
        <DictionaryProvider dictionary={dictionary}>
          {children}
        </DictionaryProvider>
        <footer>
          <Footer lang={params.lang}/>
        </footer>
      </body>
    </html>
  );
}
