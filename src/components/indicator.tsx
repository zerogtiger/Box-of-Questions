import { fgColor } from "./color"
import { bgColor } from "./color"
import { shadowColor } from "./color"

export default function Indicator({ color }: { color: string }) {
  // const twclassname = `border border-black w-fit px-3 py-[1px] rounded-[10px] text-sm font-semibold ${fgColor[fg]} ${bgColor[bg]} ${shadowColor[shadow]}`

  return (
    // <div className={twclassname}>
    <div className={`border border-black h-fit w-fit px-[3px] pt-[3px] pb-[6px] rounded-full text-[14px] leading-none font-semibold ${fgColor[color]} grayshadow`}>
      ⬤ 
    </div>
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
