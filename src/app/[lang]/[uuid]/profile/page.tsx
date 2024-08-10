"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import React, { useState, useEffect } from "react";
import { _profile_deleteAccount, _profile_getPFPURL, _profile_getUserInfo, _profile_setNewName, _profile_setNewPrompt, _profile_toggleBox, _profile_togglePostNew, _profile_toggleQOpen, _profile_updatePassword, _profile_user } from "./actions";
import { useRouter } from "next/navigation";
import { default as IMAGE } from "next/image";
import { hash } from "@/components/hash";
import { createClient } from '@supabase/supabase-js'
import { _login_deleteCookie } from "../../login/actions";
import { _answer_checkPassword } from "../answer/actions";
import Metadata from "@/components/metadata";
import { useDictionary } from "../../dictionaryProvider";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export default function Profile({ params }: { params: { uuid: string } }) {

  const [question, setQuestion] = useState<string>("");

  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [newName, setNewName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [id, setId] = useState<number>(-1);
  const [qOpen, setQOpen] = useState<boolean>(false);
  const [boxOpen, setBoxOpen] = useState<boolean>(false);
  const [postNew, setPostNew] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ");
  const [newPrompt, setNewPrompt] = useState<string>("◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ");

  const [boxInd, setBoxInd] = useState<string[]>(["gray", "yellow", "gray"]);
  const [askInd, setAskInd] = useState<string[]>(["gray", "yellow", "gray"]);
  const [postInd, setPostInd] = useState<string[]>(["gray", "yellow", "gray"]);
  const [nameInd, setNameInd] = useState<string>("gray");
  const [promptInd, setPromptInd] = useState<string>("gray");
  const [passwordInd, setPasswordInd] = useState<string>("lightgreen");
  const [pfpInd, setPFPInd] = useState<string>("lightgreen");
  const [pfpUploadInd, setPFPUploadInd] = useState<string>("lightgreen");

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [pfp, setPFP] = useState<string>("");
  const [pfpDisplay, setPfpDisplay] = useState<string>("/pfp_preload.png");

  const [confirmDel, setConfirmDel] = useState<boolean>(false);

  const username = params.uuid;
  const router = useRouter();

  useEffect(() => {
    const updateData = async () => {
      const _user: _profile_user | void = await _profile_getUserInfo(username);
      const user: _profile_user = (_user as _profile_user);
      setName(user.name);
      setNewName(user.name);
      setId(user.id);
      setQOpen(user.q_open);
      setBoxOpen(user.box_open);
      setPostNew(user.post_new);
      setPrompt(user.q_header);
      setNewPrompt(user.q_header);
      const newAskInd = askInd.map((c, i) => {
        if (i === (user.q_open ? 0 : 2)) { return (user.q_open ? "lightgreen" : "lightred") }
        else { return "gray" }
      });
      setAskInd(newAskInd);
      const newBoxInd = boxInd.map((c, i) => {
        if (i === (user.box_open ? 0 : 2)) { return (user.box_open ? "lightgreen" : "lightred") }
        else { return "gray" }
      });
      setBoxInd(newBoxInd);
      const newPostInd = postInd.map((c, i) => {
        if (i === (user.post_new ? 0 : 2)) { return (user.post_new ? "lightgreen" : "lightred") }
        else { return "gray" }
      });
      setPostInd(newPostInd);
      const tmp_pfp = await _profile_getPFPURL(username);
      // console.log(await fetch(tmp_pfp));
      setPfpDisplay(tmp_pfp);
      setPFP(tmp_pfp);
      // router.refresh();
    }

    const verifyPassword = async () => {
      const verdict = await _answer_checkPassword(username);
      if (verdict === true) {
        updateData();
        return;
      }
      else {
        await _login_deleteCookie();
        router.push("/login");
        return;
      }
      // setPasswordInd("green");
    }

    verifyPassword();
  }, []);

  useEffect(() => {
    if (newPrompt !== prompt) {
      setPromptInd("yellow");
    }
    else {
      setPromptInd("lightgreen");
    }
  }, [newPrompt, prompt]);

  useEffect(() => {
    if (newName !== name) {
      setNameInd("yellow");
    }
    else {
      setNameInd("lightgreen");
    }
  }, [newName, name]);

  useEffect(() => {
    if (newPassword !== "" || confirmPassword !== "") {
      setPasswordInd("yellow");
    }
    // else {
    //   setPasswordInd("lightgreen");
    // }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    const newAskInd = askInd.map((c, i) => {
      if (i === (qOpen ? 0 : 2) && id !== -1) { return (qOpen ? "lightgreen" : "lightred") }
      else { return "gray" }
    });
    setAskInd(newAskInd);
  }, [qOpen]);

  useEffect(() => {
    const newBoxInd = boxInd.map((c, i) => {
      if (i === (boxOpen ? 0 : 2) && id !== -1) { return (boxOpen ? "lightgreen" : "lightred") }
      else { return "gray" }
    });
    setBoxInd(newBoxInd);
  }, [boxOpen]);

  useEffect(() => {
    const newPostInd = postInd.map((c, i) => {
      if (i === (postNew ? 0 : 2) && id !== -1) { return (postNew ? "lightgreen" : "lightred") }
      else { return "gray" }
    });
    setPostInd(newPostInd);
  }, [postNew]);

  const deleteAccount = async () => {
    if (confirmDel === true) {
      setConfirmDel(false);
    }
    else {
      setConfirmDel(true);
    }
  }

  const logOut = async () => {
    // console.log("hi");
    await _login_deleteCookie();
    router.replace("/login");
    return;
  }

  const viewBox = async () => {
    if (confirmDel === true) {
      await _profile_deleteAccount(username);
      setConfirmDel(false);
      router.push("/login");
    }
    else {
      router.push("answer");
    }
  }

  const togglePostNew = async () => {
    const newPostInd = postInd.map((c, i) => {
      if (i === 1) { return "yellow" }
      else { return "gray" }
    });
    setPostInd(postInd);
    _profile_togglePostNew(id as number, !postNew);
    setPostNew(!postNew);
  }

  const toggleQOpen = async () => {
    const newAskInd = askInd.map((c, i) => {
      if (i === 1) { return "yellow" }
      else { return "gray" }
    });
    setAskInd(newAskInd);
    _profile_toggleQOpen(id as number, !qOpen);
    setQOpen(!qOpen);
  }

  const toggleBoxOpen = async () => {
    const newBoxInd = boxInd.map((c, i) => {
      if (i === 1) { return "yellow" }
      else { return "gray" }
    });
    setBoxInd(newBoxInd);
    _profile_toggleBox(id as number, !boxOpen);
    setBoxOpen(!boxOpen);
  }

  const changeName = async () => {
    if (name === newName) return;
    setNameInd("yellow");
    _profile_setNewName(id as number, newName);
    setName(newName);
  }

  const changePrompt = async () => {
    if (prompt === newPrompt) return;
    setPromptInd("yellow");
    _profile_setNewPrompt(id as number, newPrompt);
    setPrompt(newPrompt);
  }

  async function previewPFP() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 200;
    canvas.height = 200;

    // console.log((document.getElementById("display_pfp") as HTMLImageElement).src);
    setPFPInd("yellow");
    const input = document.getElementById("file_input") as HTMLInputElement;
    if (input && (input as HTMLInputElement).files && (input as HTMLInputElement).files![0]) {
      // console.log("drawing");
      const file = (input as HTMLInputElement).files![0];
      const img = new Image();
      ctx.clearRect(0, 0, 201, 201);
      img.addEventListener("load", () => {
        const m = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 201, 201);
        setPfpDisplay(canvas.toDataURL("image/png"));
      });
      img.src = URL.createObjectURL(file);
    }
    else {
      setPFPInd("lightgreen");
      return;
    }
  }

  async function changePFP(formData: FormData) {

    // if no new image, return
    if ((formData.get("image") as File).name === "") {
      setPFPUploadInd("lightgreen");
      return;
    }
    // console.log("now");
    const pfpURL = (document.getElementById("display_pfp") as HTMLImageElement).src;
    setPFP(pfpURL);

    // decode
    let arr = pfpURL.split(","),
      mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const ufile = new File([u8arr], username + ".png", { type: mime });

    // upload
    const { error: uploadError } = await supabase.storage.from("user_pfp").upload(username + ".png", ufile, {
      upsert: true,
    });
    if (uploadError) {
      throw uploadError;
    }
    (document.getElementById("pfp_upload") as HTMLFormElement).reset();
    setPFPInd("lightgreen");
    setPFPUploadInd("lightgreen");
  }

  const changePassword = async () => {
    if (newPassword === "" && confirmPassword === "") {
      return;
    }
    else if (newPassword !== confirmPassword) {
      setPasswordInd("lightred");
      setNewPassword("");
      setConfirmPassword("");
    }
    else {
      setPasswordInd("lightgreen");
      _profile_updatePassword(username, hash(newPassword));
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const dict = useDictionary();

  function formatNewline(val: string) {
    return val.split(/\n/).map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>);
  }
  return (
    <>
      <Metadata title={`${name} ${dict.profile.settings} │ ${dict.questionBox}`} description="" />
      <main className="bg-white min-h-screen">
        <div className="flex justify-center ">
          <div className="-border border-black max-w-[440px] w-3/4">
            <Header title={name} subtitle={dict.profile.settings} url={pfp} />
            <div className="-border flex mt-2 mb-4 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                {dict.profile.profile} ⟵
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" link="share">
                  <div className="-border py-3 px-3 leading-4 font-semibold">
                    {formatNewline(dict.shareBox)}
                  </div>
                </Button>
                <Button fg="white" bg="black" shadow="darkgray" link="answer">
                  <div className="py-3 px-3 leading-4 font-semibold">
                    {formatNewline(dict.profile.checkInbox)}
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex flex-row">
              <IMAGE id="display_pfp" width={64} height={64} src={pfpDisplay} alt="Profile photo" />
              <form action={changePFP} className="w-full -border border-black place-items-center justify-end" id="pfp_upload">
                <div className="flex pb-3 justify-end gap-3 ">
                  <Indicator color={pfpInd} />
                  <Button fg="white" bg="black" shadow="darkgray">
                    <label className="px-5 leading-6 font-semibold" htmlFor="file_input">
                      ⟵ {dict.profile.uploadPfp}
                    </label>
                  </Button>
                </div>
                <div className="-border flex justify-end gap-3">
                  <Indicator color={pfpUploadInd} />
                  <Button fg="white" bg="black" shadow="darkgray" onclick={() => setPFPUploadInd("yellow")}>
                    <button className="px-5 leading-6 font-semibold" type="submit">
                      ⟵ {dict.profile.change}
                    </button>
                  </Button>
                </div>
                <input
                  id="file_input"
                  className="hidden"
                  type="file"
                  name="image"
                  accept="image/jpeg, image/apng, image/avif, image/gif, image/png, image/webp"
                  onChange={previewPFP}
                />
              </form>
            </div>
            <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
              {dict.profile.changePassword}
            </div>
            <TextField maxChar={-1} placeholder={dict.profile.newPassword} rows={1} text={newPassword} setText={setNewPassword} password={true} />
            <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
              {dict.profile.confirmPassword}
            </div>
            <TextField maxChar={-1} placeholder={dict.profile.confirmPassword} rows={1} text={confirmPassword} setText={setConfirmPassword} password={true} />
            <div className="flex justify-end gap-3 pb-2 ">
              <Indicator color={passwordInd} />
              <Button fg="white" bg="black" shadow="darkgray" onclick={changePassword}>
                <div className="px-5 leading-6 font-semibold">
                  {dict.profile.change} ⟶
                </div>
              </Button>
            </div>
            <div className="-border flex mt-2 mb-4 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                {dict.profile.box} ⟵
              </div>
            </div>
            <div className="-border flex mt-2 mb-4 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                <Indicator color={askInd[0]} />
                <Indicator color={askInd[1]} />
                <Indicator color={askInd[2]} />
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" onclick={toggleQOpen}>
                  <div className="px-3 leading-6 font-semibold">
                    ⟵ {dict.profile.startStopAsk}
                  </div>
                </Button>
              </div>
            </div>
            <div className="-border flex mt-2 mb-4 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                <Indicator color={boxInd[0]} />
                <Indicator color={boxInd[1]} />
                <Indicator color={boxInd[2]} />
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" onclick={toggleBoxOpen}>
                  <div className="px-3 leading-6 font-semibold">
                    ⟵ {dict.profile.startStopView}
                  </div>
                </Button>
              </div>
            </div>
            <div className="-border flex mt-2 mb-5 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                <Indicator color={postInd[0]} />
                <Indicator color={postInd[1]} />
                <Indicator color={postInd[2]} />
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" onclick={togglePostNew}>
                  <div className="px-3 leading-6 font-semibold">
                    ⟵ {dict.profile.showNewQuestions}
                  </div>
                </Button>
              </div>
            </div>
            <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
              {dict.profile.displayName}
            </div>
            <TextField maxChar={250} placeholder={dict.profile.displayName} rows={1} text={newName} setText={setNewName} />
            <div className="flex justify-end gap-3 ">
              <Indicator color={nameInd} />
              <Button fg="white" bg="black" shadow="darkgray" onclick={changeName}>
                <div className="px-5 leading-6 font-semibold">
                  {dict.profile.change} ⟶
                </div>
              </Button>
            </div>
            <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
              {dict.profile.boxPrompt}
            </div>
            <TextField maxChar={1000} placeholder={dict.profile.whatAsk} rows={6} text={newPrompt} setText={setNewPrompt} />
            <div className="flex">
              <div className="w-1/2 text-sm leading-none">
                ↓ {dict.profile.previewBelow}
              </div>
              <div className="w-1/2 flex justify-end gap-3 ">
                <Indicator color={promptInd} />
                <Button fg="white" bg="black" shadow="darkgray" onclick={changePrompt}>
                  <div className="px-5 leading-6 font-semibold">
                    {dict.profile.change} ⟶
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pb-3 bg-[#EFEFEF] flex justify-center">
          <div className="-border border-black max-w-[440px] w-3/4">
            <Header title={newName} subtitle={"の" + dict.ask.box} url={pfp} />
            <div className="-border border-black text-black text-[14px] font-normal mt-6 mb-1">
              {newPrompt}
            </div>
            <TextField maxChar={1000} placeholder={dict.profile.theirQuestion} rows={6} text={question} setText={setQuestion} />
          </div>
        </div>
        <div className="flex justify-center ">
          <div className="-border border-black max-w-[440px] w-3/4">
            <div className="text-center text-sm my-6 text-[#AAAAAA]">
              {dict.profile.bottomOfPage}
            </div>
            <div className="flex mb-8">
              <div className="w-1/2 -border flex gap-4">
                <Button fg={confirmDel ? "white" : "black"} bg={confirmDel ? "darkgreen" : "white"} shadow={confirmDel ? "black" : "darkred"} onclick={deleteAccount}>
                  <div className="py-3 px-3 leading-4 font-semibold" >
                    {
                      confirmDel ?
                        <div>
                          {dict.profile.cancel}
                          < br />
                          ⟵-
                        </div>
                        :
                        <div>
                          {formatNewline(dict.profile.deleteAccount)}
                        </div>
                    }
                  </div>
                </Button>
                <Button fg="black" bg="white" shadow="darkred" onclick={logOut}>
                  <div className="py-3 px-3 leading-4 font-semibold">
                    {formatNewline(dict.logOut)}
                  </div>
                </Button>
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" link="share">
                  <div className="-border py-3 px-3 leading-4 font-semibold">
                    {formatNewline(dict.shareBox)}
                  </div>
                </Button>
                <Button fg="white" bg={confirmDel ? "darkred" : "black"} shadow={confirmDel ? "black" : "darkgray"} onclick={viewBox}>
                  <div className="py-3 px-3 leading-4 font-semibold">
                    {confirmDel ?
                      <div>
                        {dict.profile.confirm}
                        <br />
                        ⟶-
                      </div>
                      :
                      <div>
                        {formatNewline(dict.profile.checkInbox)}
                      </div>
                    }
                  </div>
                </Button>
              </div>
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
