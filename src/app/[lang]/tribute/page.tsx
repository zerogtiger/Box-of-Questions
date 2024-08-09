"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import TextDisplay from "@/components/textdisplay";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDictionary } from "../dictionaryProvider";
import React from "react";

export default function Home({ params }: { params: { lang: string } }) {

  const { version } = require('../../../../package.json');

  const router = useRouter();

  const dict = useDictionary();

  function formatNewline(val: string) {
    return val.split(/\n/).map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>);
  }
  return (
    <main className="bg-white flex justify-center min-h-screen">
      <div className="-border border-black max-w-[440px] w-2/3">
        <Header title={dict.questionBox} subtitle="" tribute={true} />
        <div className="border border-black mt-2 my-5 bg-[#EEEEEE] w-fit px-3 py-[1px] rounded-[10px] text-sm font-semibold grayshadow">
          {version}
        </div>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            {dict.tribute.someoneSaid}
          </p>
          <p className="text-black my-2 leading-[18px]">
            {dict.tribute.madeByTiger}
            <br />
            < br />
            {dict.tribute.thanksToCalina}
          </p>
        </TextDisplay>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            {dict.tribute.someoneSaid}
          </p>
          <p className="text-black my-2 leading-[18px]">
            {dict.tribute.feedback}
            <Link target="_blank" href={"https://www.zerotiger.ca/contact"} className="text-blue-600 underline underline-offset-3">
              www.zerotiger.ca/contact
            </Link>
            <br />
            <br />
            {dict.tribute.hours}
          </p>
        </TextDisplay>
        <TextDisplay>
          <p className="text-[#AAAAAA] my-1">
            {dict.tribute.someoneSaid}
          </p>
          <p className="text-black my-2 leading-[18px]">
            {dict.tribute.thanks}
          </p>
        </TextDisplay>
        <div className="flex justify-end">
          <Button bg="black" fg="white" shadow="darkgray" onclick={() => router.back()}>
            <div className="mx-3">
              ← {dict.tribute.back}
            </div>
          </Button>
        </div>
      </div>
    </main >
  );
}
