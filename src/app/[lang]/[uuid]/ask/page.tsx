"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import { _ask_getData, _ask_user, _ask_submitData } from "./actions";
import React, { useEffect, useState } from "react";
import { _profile_getPFPURL } from "../profile/actions";
import Metadata from "@/components/metadata";
import { useDictionary } from "../../dictionaryProvider";

export default function Ask({ params }: { params: { uuid: string } }) {

  const [question, setQuestion] = useState<string>("");
  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [id, setId] = useState<number>(-1);
  const [qOpen, setQOpen] = useState<boolean>(true);
  const [postNew, setPostNew] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ");
  const [color, setColor] = useState<string>("lightgreen"); // indicator should reflect change from empty
  const [pfp, setPFP] = useState<string>("");

  const username = params.uuid;

  useEffect(() => {
    const updateData = async () => {
      const user: _ask_user = await _ask_getData(username);
      setId(user.id);
      setName(user.name);
      setPrompt(user.q_header);
      setQOpen(user.q_open);
      setPostNew(user.post_new);
      const tmpPfp = await _profile_getPFPURL(username);
      setPFP(tmpPfp);
    };

    updateData();
  }, []);

  const submit = async () => {
    if (question) {
      setColor("yellow");
      await _ask_submitData(id, question, postNew);
      setQuestion("");
      setColor("lightgreen");
    }
  }

  const dict = useDictionary();

  function formatNewline(val: string) {
    return val.split(/\n/).map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>);
  }

  return (
    <>
      <Metadata title={`${name} の ${dict.ask.box} │ ${dict.questionBox}`} description="" />
      <main className="bg-white flex justify-center min-h-screen">
        <div className="-border border-black max-w-[440px] w-3/4">
          <Header title={name} subtitle={"の" + dict.ask.box} url={pfp} />
          {
            qOpen ? [
              <div className="-border border-black text-black text-[14px] font-normal mt-6 mb-1">
                {prompt}
              </div>,
              (id === -1 ? "" :
                <TextField maxChar={1000} placeholder={dict.ask.askSomething} rows={6} text={question} setText={setQuestion} />)
            ] :
              <div className="-border border-black text-black text-[14px] font-normal mt-6 mb-1 pb-6">
                {dict.ask.noMorePaper}
              </div>
          }
          <div className="flex">
            <div className="w-1/2 -border flex gap-4">
              <Button fg="black" bg="white" shadow="darkgreen" link="/login">
                <div className="py-3 px-3 leading-4 font-semibold">
                  {formatNewline(dict.ask.getBox)}
                </div>
              </Button>
              <Button fg="white" bg="black" shadow="darkgray" link={`box`}>
                <div className="py-3 px-3 leading-4 font-semibold">
                  {formatNewline(dict.ask.checkoutBox + "→")}
                </div>
              </Button>
            </div>
            {
              qOpen && id !== -1 ?
                <div className=" w-1/2 justify-end -border flex gap-3">
                  <Indicator color={color} />
                  <Button fg="white" bg="black" shadow="darkgray" onclick={submit} link="box">
                    <div className="py-3 px-3 leading-4 font-semibold">
                      {dict.ask.submit}
                      <br />
                      -⟶
                    </div>
                  </Button>
                </div> : ""
            }
          </div>
        </div>
      </main >
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
