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


  // <div className="border border-black my-5 w-full bg-[#EEEEEE] px-3 py-[4px] rounded-[10px] text-sm font-normal shadow-[4px_4px_0px_0px_#505050]">
  // </div>
  if (rows === 1 && password === true) {
    return (
      <div className="-border border-black flex relative items-end mt-1 mb-3">
        <input
          name="message"
          value={text}
          type="password"
          placeholder={placeholder}
          className={`border border-black py-2 w-full bg-[#D9D9D9] px-3 rounded-[10px] placeholder:text-gray placeholder:text-sm text-sm font-normal shadow-[4px_4px_0px_0px_#505050] ${rows == 1 ? "resize-none" : ""}`}
          onChange={e => setText(e.target.value)}
          maxLength={maxChar}
        />
      </div>
    )
  }
  else if (rows === 1) {
    return (
      <div className="-border border-black flex relative items-end mt-1 mb-3">
        <input
          name="message"
          value={text}
          placeholder={placeholder}
          className={`border border-black py-2 w-full bg-[#D9D9D9] px-3 rounded-[10px] placeholder:text-gray placeholder:text-sm text-sm font-normal shadow-[4px_4px_0px_0px_#505050] ${rows == 1 ? "resize-none" : ""}`}
          onChange={e => setText(e.target.value)}
          maxLength={maxChar}
        />
        <div className="text-[10px] -border border-black absolute right-2 bottom-[10px] text-[#6F6F6F]">
          {maxChar == -1 ? "" : `${text.length}/${maxChar}`}
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="-border border-black flex relative items-end mt-1 mb-3">
        <textarea
          name="message"
          value={text}
          placeholder={placeholder}
          className={`border border-black py-2 w-full bg-[#D9D9D9] px-3 rounded-[10px] placeholder:text-gray placeholder:text-sm text-sm font-normal shadow-[4px_4px_0px_0px_#505050] ${rows == 1 ? "resize-none" : ""}`}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChar}
          rows={rows}
          wrap={rows == 1 ? "off" : ""}
        />
        <div className="text-[10px] -border border-black absolute right-2 bottom-[10px] text-[#6F6F6F]">
          {maxChar == -1 ? "" : `${text.length}/${maxChar}`}
        </div>
      </div>
    )
  }
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
