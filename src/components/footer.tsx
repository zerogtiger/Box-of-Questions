import Image from "next/image"
import Link from "next/link"

export default function Footer({ lang }: { lang: string }) {

  const { version } = require('../../package.json');

  return (
    <div className="bg-black align-middle items-center min-h-[30px] flex justify-center ">
      <div className="max-h-[100vh] min-h-[100vh] w-full fixed bg-black z-[-1]">
      </div>
      <Link
        href={`/${lang}/tribute`}
        className="cursor-pointer">
        <div className="flex -border w-fit text-[11px] items-center text-[#7c7c7c] font-semibold">
          <Image
            src="/grey7c7c7c_nobg.svg"
            alt="Vercel Logo"
            className="-border border-white mr-1"
            width={20}
            height={20}
            priority />
            {lang == "en" ? "Box of のuestions" :  "提问の箱子"} | {version}
        </div>
      </Link>
    </div>
  )
}
