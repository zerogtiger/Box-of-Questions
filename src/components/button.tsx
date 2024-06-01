import { ReactNode } from "react"
import { fgColor } from "./color"
import { bgColor } from "./color"
import { shadowColor } from "./color"
import Link from "next/link"

export default function Button({ fg, bg, shadow, children, onclick, link }:
  {
    fg: string,
    bg: string,
    shadow: string,
    children: ReactNode,
    onclick?: (() => void) | undefined,
    link?: string
  }) {

  const twclassname = `flex items-center align-middle border border-black w-fit rounded-[10px] text-sm font-semibold ${fgColor[fg]} ${bgColor[bg]} ${shadowColor[shadow]}`

  return link ? (
    <Link href={link}>
      <div className={twclassname} onClick={onclick}>
        {children}
      </div >
    </Link>
  ) : (
    <div className={twclassname} onClick={onclick}>
      {children}
    </div >
  )
  //   <div className="bg-black align-middle items-center min-h-[30px] flex justify-center ">
  //   <Link
  //   href={"/tribute"}
  // className="cursor-pointer">
  //   <div className="flex -border w-fit text-[11px] items-center text-[#7c7c7c] font-semibold">
  //   <Image
  //   src="/gray7c7c7c_nobg.svg"
  //   alt="Vercel Logo"
  //   className="-border border-white mr-1"
  //   width={20}
  // height={20}
  // priority />
  //   提问の箱子 | v.0.0.1
  //   </div>
  //   </Link>
  //   </div>
}
