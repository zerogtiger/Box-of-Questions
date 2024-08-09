"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import TextDisplay from "@/components/textdisplay";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { lang: string }}) {

  const { version } = require('../../../../package.json');

  const router = useRouter();

  return (
    <main className="bg-white flex justify-center min-h-screen">
      <div className="-border border-black max-w-[440px] w-2/3">
        <Header title={"提问の箱子"} subtitle="" tribute={true} />
        <div className="border border-black mt-2 my-5 bg-[#EEEEEE] w-fit px-3 py-[1px] rounded-[10px] text-sm font-semibold grayshadow">
          {version}
        </div>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            有人说：
          </p>
          <p className="text-black my-2 leading-[18px]">
            提问の箱子由 Tiger🞄丁 设计并制作。
            <br />
            < br />
            特此鸣谢 Calina🞄刘 对匿名提问箱的需求，及借此提供的灵感。
          </p>
        </TextDisplay>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            有人说：
          </p>
          <p className="text-black my-2 leading-[18px]">
            如有意见或建议，请通过个人网站联系：
            <Link target="_blank" href={"https://www.zerotiger.ca/contact"} className="text-blue-600 underline underline-offset-3">
              www.zerotiger.ca/contact
            </Link>
            <br />
            <br />
            所有信息一律48小时内作答。
          </p>
        </TextDisplay>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            有人说：
          </p>
          <p className="text-black my-2 leading-[18px]">
            感谢您对提问の箱子的支持。
          </p>
        </TextDisplay>
        <div className="flex justify-end">
          <Button bg="black" fg="white" shadow="darkgray" onclick={() => router.back()}>
            <div className="mx-3">
              ← 返回
            </div>
          </Button>
        </div>
      </div>
    </main >
  );
}
