"use client"
import { useEffect, useState } from "react"

export default function TextField({ maxChar, placeholder, rows, text, setText, password }:
  {
    maxChar: number,
    placeholder: string,
    rows: number,
    text: string,
    setText: (arg0: string) => void,
    password?: boolean,
  }) {

  const [count, setCount] = useState<number>(text ? text.length : 0);
  const [dummy, setDummy] = useState<string>("");

  // const countChar = (): void => {
  //   setText(
  // }

  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // if (count < e.currentTarget.value.length) {
    //   setDummy(dummy.substring(0, Math.max(dummy.length-1, 0)) + (dummy.length === 0 ? "" : "•") + e.currentTarget.value.charAt(e.currentTarget.value.length-1));
    // }
    // else {
    //   setDummy(dummy.substring(0, dummy.length-1));
    // }
    setCount(e.currentTarget.value.length);
    if (setText) {
      setText(e.currentTarget.value);
    }
    // console.log(text);
  }

  // <div className="border border-black my-5 w-full bg-[#EEEEEE] px-3 py-[4px] rounded-[10px] text-sm font-normal shadow-[4px_4px_0px_0px_#505050]">
  // </div>

  return (
    <div className="-border border-black flex relative items-end mt-1 mb-3">
      <textarea
        name="message"
        value={text}
        placeholder={placeholder}
        className={`border border-black py-2 w-full bg-[#D9D9D9] px-3 rounded-[10px] placeholder:text-gray placeholder:text-sm text-sm font-normal shadow-[4px_4px_0px_0px_#505050] ${rows == 1 ? "resize-none" : ""}`}
        onChange={update}
        maxLength={maxChar}
        rows={rows}
        wrap={rows == 1 ? "off" : ""}
      />
      <div className="text-[10px] -border border-black absolute right-2 bottom-[10px] text-[#6F6F6F]">
        {maxChar == -1 ? "" : `${count}/${maxChar}`}
      </div>
    </div>
    // 'h-fit w-full bg-inherit text-sm sm:text-[12pt] placeholder:text-gray placeholder:text-sm sm:placeholder:text-[12pt] text-black align-middle outline-none border-none'



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
