"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import { useState } from "react";
import { _login_loginable, _login_registerable } from "./actions";
import { hash } from "@/components/hash";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loginColor, setLoginColor] = useState<string>("gray");
  const [regColor, setRegColor] = useState<string>("gray");

  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regPC, setRegPC] = useState<string>("");

  const router = useRouter();

  const login = async () => {
    setLoginColor("yellow");
    const loginable = await _login_loginable(loginUsername, hash(loginPassword));
    if (loginable === true) {
      setLoginColor("lightgreen");
      router.push("/" + loginUsername + "/" + hash(loginPassword) + "/answer");
    }
    else {
      setLoginPassword("");
      setLoginColor("lightred");
    }
  }

  const register = async () => {
    setRegColor("yellow");
    const passwordsEqual = (regPassword === regPC);
    const nonEmpty = (regName !== "" && regUsername !== "");
    if (passwordsEqual === true && nonEmpty === true) {
      const regable = await _login_registerable(regName, regUsername, hash(regPassword));
      if (regable === true) {
        setRegColor("lightgreen");
        router.push("/" + regUsername + "/" + hash(regPassword) + "/profile");
      }
      else {
        setRegColor("lightred");
      }
    }
    else {
      setRegColor("lightred");
    }
  }

  return (
    <main className="bg-white flex justify-center min-h-screen">
      <div className="-border border-black max-w-[440px] w-2/3">
        <Header title={"提问の箱子"} subtitle="" />
        <div className="-border text-black text-2xl font-bold mt-2 mb-2">
          登录 ←
        </div>
        <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
          用户名
        </div>
        <TextField maxChar={250} placeholder={"用户名登录"} rows={1} text={loginUsername} setText={setLoginUsername} />
        <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          密码
        </div>
        <TextField maxChar={-1} placeholder={"账号密码"} rows={1} text={loginPassword} setText={setLoginPassword} password={true} />
        <div className="-border flex justify-end mt-4 gap-3">
          <Indicator color={loginColor} />
          <Button bg="black" fg="white" shadow="darkgray" onclick={() => login()}>
            <div className="py-[1px] px-4">
              →
            </div>
          </Button>
        </div>
        <div className="-border text-black text-2xl font-bold mt-3 mb-2">
          注册 ←
        </div>
        <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
          名字（匿名）
        </div>
        <TextField maxChar={250} placeholder={"注册后可更改"} rows={1} text={regName} setText={setRegName} />
        <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          用户名
        </div>
        <TextField maxChar={250} placeholder={"账户用户名"} rows={1} text={regUsername} setText={setRegUsername} />
        <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          密码
        </div>
        <TextField maxChar={-1} placeholder={"设置密码"} rows={1} text={regPassword} setText={setRegPassword} password={true} />
        <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          确认密码
        </div>
        <TextField maxChar={-1} placeholder={"确认账户密码"} rows={1} text={regPC} setText={setRegPC} password={true} />
        <div className="-border flex justify-end mt-4 mb-10 gap-3">
          <Indicator color={regColor} />
          <Button bg="black" fg="white" shadow="darkgray" onclick={() => register()}>
            <div className="py-[1px] px-4">
              →
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
}
