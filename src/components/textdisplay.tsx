import { ReactNode } from "react"

export default function TextDisplay({ children }:
  { children: ReactNode }) {

  return (
    <div className="border border-black my-[14px] w-full bg-[#EEEEEE] px-3 py-[4px] rounded-[10px] text-sm font-normal shadow-[4px_4px_0px_0px_#505050]">
      {children}
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
