import Image from "next/image";
import Link from "next/link";

export default function Header({ title, subtitle, tribute, url }:
  { title: string, subtitle: string, tribute?: boolean, url: string }) {
  return (
    <div className="relative -border flex justify-center">
      <div className="mt-9 -order border-black w-full">
        <div className="text-left text-[40px] font-bold leading-[3rem]">
          ↓
          <br />
          {title}
        </div>
        <div className={subtitle ? "mt-[-4pt] font-bold text-[24px]" : ""}>
          {subtitle}
        </div>
      </div>
      <Image
        id="headerPFP"
        src={"/black_nobg.svg"}
        // src={tribute && url ? "/black_nobg.svg" : url}
        alt="Profile picture"
        className="absolute right-[-20px] top-4"
        width={40}
        height={40}
        priority />
    </div>
  )
}
