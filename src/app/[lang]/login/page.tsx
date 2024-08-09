"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import { useEffect, useState } from "react";
import { _login_createCookie, _login_getCookies, _login_getDict, _login_loginable, _login_registerable } from "./actions";
import { hash } from "@/components/hash";
import { useRouter } from "next/navigation";
import Metadata from "@/components/metadata";
import { useDictionary } from "../dictionaryProvider";


export default function Login({ params }: { params: { lang: string } }) {
  const [loginColor, setLoginColor] = useState<string>("gray");
  const [regColor, setRegColor] = useState<string>("gray");

  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regPC, setRegPC] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      // console.log("hi");
      const username = await _login_getCookies();
      if (username) {
        router.push(`/${username}/answer`);
      }
      return;
    };

    init();
  }, [])

  const login = async () => {
    setLoginColor("yellow");
    const loginable = await _login_loginable(loginUsername, hash(loginPassword));
    if (loginable) {
      setLoginColor("lightgreen");
      await _login_createCookie(loginable);
      router.push("/" + loginUsername + "/answer");
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
      if (regable) {
        setRegColor("lightgreen");
        await _login_createCookie(regable);
        router.push("/" + regUsername + "/profile");
      }
      else {
        setRegColor("lightred");
      }
    }
    else {
      setRegColor("lightred");
    }
  }

  const dict = useDictionary();

  return (
    <>
      <Metadata title={dict.login.login + " │ " + dict.login.signUp + " │ " + dict.questionBox} description="" />
      <main className="bg-white flex justify-center min-h-screen">
        <div className="-border border-black max-w-[440px] w-2/3">
          <Header title={dict.questionBox} subtitle="" />
          <div className="-border text-black text-2xl font-bold mt-2 mb-2">
          {dict.login.login} ←
          </div>
          <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
          {dict.login.username}
          </div>
          <TextField maxChar={250} placeholder={dict.login.accountUsername} rows={1} text={loginUsername} setText={setLoginUsername} />
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          {dict.login.password}
          </div>
          <TextField maxChar={-1} placeholder={dict.login.accountPassword} rows={1} text={loginPassword} setText={setLoginPassword} password={true} />
          <div className="-border flex justify-end mt-4 gap-3">
            <Indicator color={loginColor} />
            <Button bg="black" fg="white" shadow="darkgray" onclick={() => login()}>
              <div className="py-[1px] px-4">
                →
              </div>
            </Button>
          </div>
          <div className="-border text-black text-2xl font-bold mt-3 mb-2">
          {dict.login.signUp} ←
          </div>
          <div className="-border border-black text-black text-[14px] font-normal mt-2 mb-1">
          {dict.login.displayName}
          </div>
          <TextField maxChar={250} placeholder={dict.login.changeName} rows={1} text={regName} setText={setRegName} />
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          {dict.login.username}
          </div>
          <TextField maxChar={250} placeholder={dict.login.accountUsername} rows={1} text={regUsername} setText={setRegUsername} />
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          {dict.login.password}
          </div>
          <TextField maxChar={-1} placeholder={dict.login.accountPassword} rows={1} text={regPassword} setText={setRegPassword} password={true} />
          <div className="-border border-black text-black text-[14px] font-normal mt-4 mb-1">
          {dict.login.confirmLoginPassword}
          </div>
          <TextField maxChar={-1} placeholder={dict.login.confirmLoginPassword} rows={1} text={regPC} setText={setRegPC} password={true} />
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
    </>
  );
}
