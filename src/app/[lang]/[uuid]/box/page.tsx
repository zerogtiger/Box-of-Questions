"use client"
import Button from "@/components/button";
import Header from "@/components/header"
import TextDisplay from "@/components/textdisplay";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import React, { useEffect, useState } from "react";
import { _box_getQA, _box_getUserInfo, _box_qa, _box_user } from "./actions";
import { _profile_getPFPURL } from "../profile/actions";
import Metadata from "@/components/metadata";
import { useDictionary } from "../../dictionaryProvider";

export default function Box({ params }: { params: { lang: string, uuid: string } }) {

  const [qa, setqa] = useState<_box_qa[]>([]);
  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [id, setId] = useState<number>(-1);
  const [boxOpen, setBoxOpen] = useState<boolean>(true);
  const [pfp, setPFP] = useState<string>("");

  const username = params.uuid;

  useEffect(() => {
    const updateData = async () => {
      const user: _box_user = await _box_getUserInfo(username);
      setId(user.id);
      setName(user.name);
      setBoxOpen(user.box_open);
      const qaData: _box_qa[] = await _box_getQA(user.id);
      setqa(qaData);
      const tmpPfp = await _profile_getPFPURL(username);
      setPFP(tmpPfp);
    };

    updateData();
  }, []);

  const dict = useDictionary();

  function formatNewline(val: string) {
    return val.split(/\n/).map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>);
  }
  function langCond(valEn: string, valZh: string) {
    return (params.lang == "en" ? valEn : valZh);
  }
  return (
    <>
      <Metadata title={`${name} の ${dict.box.box} │ ${dict.questionBox}`} description="" />
      <main className="bg-white flex justify-center min-h-screen">
        <div className="-border border-black max-w-[440px] w-3/4">
          <Header title={name} subtitle={"の" + dict.box.box} url={pfp} />
          {
            boxOpen && id !== -1 ?
              <div className="flex mt-2 mb-4">
                <div className="w-1/2 -border flex gap-4 font-bold text-[40px] leading-snug">
                  ↓
                </div>
                <div className={langCond("w-2/3 flex justify-end gap-3 mt-4", " w-1/2 justify-end -border flex gap-3")}>
                  <Button fg="white" bg="black" shadow="darkgray" link="ask">
                    <div className={langCond("py-[2px] px-4 font-semibold", "py-3 px-3 leading-4 font-semibold")}>
                      {formatNewline(dict.box.askQuestion)}
                    </div>
                  </Button>
                </div>
              </div> : ""
          }
          {boxOpen ?
            qa?.map((ele: _box_qa, key: number) => {
              return <TextDisplay>
                <p className="text-[#AAAAAA] my-1">
                  {dict.box.someoneAsked}
                </p>
                <p className="text-black my-2 leading-[18px] whitespace-pre-wrap">
                  {ele.question}
                </p>
                {ele.answer ? [
                  <p className="text-end text-[#AAAAAA] my-1">
                    {dict.box.theyAnswered}
                  </p>,
                  <p className="text-end text-black my-2 leading-[18px]">
                    {ele.answer}
                  </p>] : [
                  <p className="text-end text-[#AAAAAA] my-1">
                    {dict.box.haventAnswered}
                  </p>
                ]
                }
              </TextDisplay>
            })
            :
            <TextDisplay>
              <p className="text-[#AAAAAA] my-1">
                {dict.box.someoneSaid}
              </p>
              <p className="text-black my-2 leading-[18px] whitespace-pre-wrap">
                {dict.box.boxLocked}
              </p>
            </TextDisplay>
          }
          <div className="text-center text-sm my-6 text-[#AAAAAA]">
            {dict.box.bottomOfPage}
          </div>
          <div className={langCond("flex flex-col-reverse mb-8 items-end gap-3", "flex mb-8")}>
            <div className={langCond("w-full flex flex-col items-end", "w-1/2 -border flex gap-4")}>
              <Button fg="black" bg="white" shadow="darkgreen" link="/login">
                <div className={langCond("py-[2px] px-4 font-semibold", "py-3 px-3 leading-4 font-semibold")}>
                  {formatNewline(dict.box.getBox)}
                </div>
              </Button>
            </div>
            <div className={langCond("w-full flex flex-col items-end", " w-1/2 justify-end -border flex gap-3")}>
              <Button fg="white" bg="black" shadow="darkgray" link="ask">
                <div className={langCond("py-[2px] px-4 font-semibold", "py-3 px-3 leading-4 font-semibold")}>
                  {formatNewline(dict.box.askQuestion)}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
// <TextField maxChar={-1} placeholder={"账号密码"} />
// <div className="-border flex justify-end mt-4">
// <Button bg="black" fg="white" shadow="darkgray">
// →
// </Button>
// </div>
// <div className="-border text-black text-2xl font-bold mt-3 mb-2">
// 注册 ←
// </div>
// <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
// 名字（匿名）
// </div>
// <TextField maxChar={250} placeholder={"注册后可更改"} />
// <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
// 用户名
// </div>
// <TextField maxChar={250} placeholder={"账户用户名"} />
// <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
// 密码
// </div>
// <TextField maxChar={-1} placeholder={"设置密码"} />
// <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
// 确认密码
// </div>
// <TextField maxChar={-1} placeholder={"确认账户密码"} />
// <div className="-border flex justify-end mt-4 mb-10">
// <Button bg="black" fg="white" shadow="darkgray">
// →
// </Button>
// </div>
