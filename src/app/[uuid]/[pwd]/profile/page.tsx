"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import { useState, useEffect } from "react";
import { _profile_checkPassword, _profile_getPFPURL, _profile_getUserInfo, _profile_reval, _profile_setNewName, _profile_setNewPrompt, _profile_toggleBox, _profile_toggleQOpen, _profile_updatePassword, _profile_user } from "./actions";
import { useRouter } from "next/navigation";
import { default as IMAGE } from "next/image";
import { hash } from "@/components/hash";
import { decode } from "punycode";
import { createClient } from '@supabase/supabase-js'
import { throws } from "assert";
import { revalidatePath, unstable_noStore } from "next/cache";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export default function Profile({ params }: { params: { uuid: string, pwd: string } }) {
  unstable_noStore();

  const [question, setQuestion] = useState<string>("");

  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [newName, setNewName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [id, setId] = useState<number>(-1);
  const [qOpen, setQOpen] = useState<boolean>(false);
  const [boxOpen, setBoxOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ");
  const [newPrompt, setNewPrompt] = useState<string>("◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ◻️ ");

  const [boxInd, setBoxInd] = useState<string[]>(["gray", "yellow", "gray"]);
  const [askInd, setAskInd] = useState<string[]>(["gray", "yellow", "gray"]);
  const [nameInd, setNameInd] = useState<string>("gray");
  const [promptInd, setPromptInd] = useState<string>("gray");
  const [passwordInd, setPasswordInd] = useState<string>("lightgreen");
  const [pfpInd, setPFPInd] = useState<string>("lightgreen");
  const [pfpUploadInd, setPFPUploadInd] = useState<string>("lightgreen");

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [pfp, setPFP] = useState<string>("");
  const [uPFPURL, setUPFPURL] = useState<string>("");

  const username = params.uuid;
  const password = params.pwd;
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
      const tmp_pfp = await _profile_getPFPURL(username);
      console.log(tmp_pfp);
      setPFP(tmp_pfp);
      setUPFPURL(tmp_pfp);
      router.refresh();
    }

    const verifyPassword = async () => {
      const verdict = await _profile_checkPassword(username, password);
      if (verdict === false) {
        router.push("/login");
        return;
      }
      // setPasswordInd("green");
      updateData();
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
    const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      ctx.clearRect(0, 0, 64, 64);
      img.addEventListener("load", () => {
        // _profile_reval();
        const m = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 64, 64);
      });
      img.src = pfp;
      console.log(pfp);
      router.refresh();
    }
  }, [pfp]);

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
    setNameInd("yellow");
    _profile_setNewName(id as number, newName);
    setName(newName);
  }

  const changePrompt = async () => {
    setPromptInd("yellow");
    _profile_setNewPrompt(id as number, newPrompt);
    setPrompt(newPrompt);
  }

  async function changePFP(formData: FormData) {
    setPFPUploadInd("yellow");
    const file = formData.get("image") as File;
    const url = URL.createObjectURL(file);
    setPFP(url);

    // crop & downscale image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 200;
    canvas.height = 200;
    ctx.clearRect(0, 0, 201, 201);

    const img = new Image();
    img.addEventListener("load", async () => {
      const m = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 201, 201);
      const pfpURL = canvas.toDataURL("image/png");

      let arr = pfpURL.split(","),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const ufile = new File([u8arr], username + ".png", { type: mime });

      const { error: uploadError } = await supabase.storage.from("user_pfp").upload(username + ".png", ufile, {
        upsert: true,
      });
      // await _profile_reval();
      if (uploadError) {
        throw uploadError;
      }
      setPFPUploadInd("lightgreen");
      setPFPInd("lightgreen");
      setUPFPURL(canvas.toDataURL("image/png"));
      router.refresh();
    });
    img.src = pfp; // Set source path
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

  return (
    <main className="bg-white min-h-screen">

      <div className="flex justify-center ">
        <div className="-border border-black max-w-[440px] w-3/4">
          <Header title={name} subtitle="设置箱子ING" url="/pfp.jpg"/>
          <div className="-border flex mt-2 mb-4 h-fit">
            <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
              账号 ⟵
            </div>
            <div className=" w-1/2 justify-end -border flex gap-3">
              <Button fg="white" bg="black" shadow="darkgray" link="answer">
                <div className="py-3 px-3 leading-4 font-semibold">
                  查看
                  <br />
                  箱子
                </div>
              </Button>
            </div>
          </div>
          <div className="flex flex-row">
            <canvas id="canvas" width="64" height="64" className="shadow-[4px_4px_0px_0px_#505050]">
            </canvas>
            <form action={changePFP} className="w-full -border border-black place-items-center justify-end">
              <div className="flex pb-3 justify-end gap-3 ">
                <Indicator color={pfpInd} />
                <Button fg="white" bg="black" shadow="darkgray">
                  <label className="px-5 leading-6 font-semibold" htmlFor="file_input">
                    ⟵ 上传头像
                  </label>
                </Button>
              </div>
              <div className="-border flex justify-end gap-3">
                <Indicator color={pfpUploadInd} />
                <Button fg="white" bg="black" shadow="darkgray">
                  <button className="px-5 leading-6 font-semibold" type="submit">
                    ⟵ 更换
                  </button>
                </Button>
              </div>
              <input
                id="file_input"
                className="hidden"
                type="file"
                name="image"
                accept="image/jpeg, image/apng, image/avif, image/gif, image/png, image/webp"
                onChange={async () => {
                  setPFPInd("yellow");
                  const input = document.getElementById("file_input") as HTMLInputElement;
                  const file = (input ? (input as HTMLInputElement).files![0] : null) as File;
                  // console.log(file.type);
                  setPFP(URL.createObjectURL(file));
                }}
              />
            </form>
          </div>
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
            更换密码
          </div>
          <TextField maxChar={-1} placeholder={"设置密码"} rows={1} text={newPassword} setText={setNewPassword} password={true} />
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
            确认密码
          </div>
          <TextField maxChar={-1} placeholder={"确认账户密码"} rows={1} text={confirmPassword} setText={setConfirmPassword} password={true} />
          <div className="flex justify-end gap-3 pb-2 ">
            <Indicator color={passwordInd} />
            <Button fg="white" bg="black" shadow="darkgray" onclick={changePassword}>
              <div className="px-5 leading-6 font-semibold">
                更换 ⟶
              </div>
            </Button>
          </div>
          <div className="-border flex mt-2 mb-4 h-fit">
            <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
              箱子 ⟵
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
                  ⟵ 开启 / 停用提问
                </div>
              </Button>
            </div>
          </div>
          <div className="-border flex mt-2 mb-5 h-fit">
            <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
              <Indicator color={boxInd[0]} />
              <Indicator color={boxInd[1]} />
              <Indicator color={boxInd[2]} />
            </div>
            <div className=" w-1/2 justify-end -border flex gap-3">
              <Button fg="white" bg="black" shadow="darkgray" onclick={toggleBoxOpen}>
                <div className="px-3 leading-6 font-semibold">
                  ⟵ 开启 / 停用查看
                </div>
              </Button>
            </div>
          </div>
          <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
            名字（匿名）
          </div>
          <TextField maxChar={250} placeholder={"显示名"} rows={1} text={newName} setText={setNewName} />
          <div className="flex justify-end gap-3 ">
            <Indicator color={nameInd} />
            <Button fg="white" bg="black" shadow="darkgray" onclick={changeName}>
              <div className="px-5 leading-6 font-semibold">
                更换 ⟶
              </div>
            </Button>
          </div>
          <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
            提问箱提示
          </div>
          <TextField maxChar={1000} placeholder={"想让ta问什么问题呢？"} rows={6} text={newPrompt} setText={setNewPrompt} />
          <div className="flex">
            <div className="w-1/2 text-sm leading-none">
              ↓预览如下
            </div>
            <div className="w-1/2 flex justify-end gap-3 ">
              <Indicator color={promptInd} />
              <Button fg="white" bg="black" shadow="darkgray" onclick={changePrompt}>
                <div className="px-5 leading-6 font-semibold">
                  更换 ⟶
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#EFEFEF] flex justify-center">
        <div className="-border border-black max-w-[440px] w-3/4">
          <Header title={newName} subtitle="の提问箱" url="/pfp.jpg"/>
          <div className="-border border-black text-black text-[14px] font-normal mt-6 mb-1">
            {newPrompt}
          </div>
          <TextField maxChar={1000} placeholder={"ta的问题"} rows={6} text={question} setText={setQuestion} />
        </div>
      </div>


      <div className="flex justify-center ">
        <div className="-border border-black max-w-[440px] w-3/4">
          <div className="text-center text-sm my-6 text-[#AAAAAA]">
            到底啦，没有更多设置啦！
          </div>
          <div className="flex mb-8">
            <div className="w-1/2 -border flex gap-4">
            </div>
            <div className=" w-1/2 justify-end -border flex gap-3">
              <Button fg="white" bg="black" shadow="darkgray" link="answer">
                <div className="py-3 px-3 leading-4 font-semibold">
                  查看
                  <br />
                  箱子
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
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
