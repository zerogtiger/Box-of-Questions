"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { default as IMAGE } from "next/image";
import { _profile_getPFPURL, _profile_user, _profile_getUserInfo } from "../profile/actions";
import { _login_deleteCookie, _login_getCookies } from "../../login/actions";
import { _answer_checkPassword } from "../answer/actions";
import Metadata from "@/components/metadata";
import { useDictionary } from "../../dictionaryProvider";


export default function Share({ params }: { params: { uuid: string, pwd: string } }) {
  const QRCode = require('qrcode');

  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [pfp, setPFP] = useState<string>("");
  const [shareSrc, setShareSrc] = useState<string>("/pfp_preload.png");

  const username = params.uuid;
  const password = params.pwd;
  const router = useRouter();
  // const pathname = usePathname();

  const generateQR = async (text: string) => {
    try {
      return await QRCode.toDataURL(text, {
        margin: 1,
        quality: 0.99,
      });
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      var words = text.split(' ');
      var line = '';

      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }

    const roundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, message: string, offset: number) => {
      const delta = 8;
      ctx.beginPath();
      ctx.fillStyle = "#505050"
      ctx.moveTo(x + delta, y + radius + delta);
      ctx.arcTo(x + delta, y + height + delta, x + radius + delta, y + height + delta, radius);
      ctx.arcTo(x + width + delta, y + height + delta, x + width + delta, y + height - radius + delta, radius);
      ctx.arcTo(x + width + delta, y + delta, x + width - radius + delta, y + delta, radius);
      ctx.arcTo(x + delta, y + delta, x + delta, y + radius + delta, radius);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y + height, x + radius, y + height, radius);
      ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
      ctx.arcTo(x + width, y, x + width - radius, y, radius);
      ctx.arcTo(x, y, x, y + radius, radius);
      ctx.fillStyle = "white"
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "black"
      ctx.font = "normal 27px inter"
      ctx.textAlign = "center";
      wrapText(ctx, message, x + width / 2 + 5, y + 39, width, 40);
      // ctx.fillText(message, x + width/2 , y + 39);
    }

    const updateData = async () => {
      const _user: _profile_user | void = await _profile_getUserInfo(username);
      const user: _profile_user = (_user as _profile_user);
      setName(user.name);
      const tmp_pfp = await _profile_getPFPURL(username);
      // console.log(await fetch(tmp_pfp));
      // (document.getElementById("display_pfp") as HTMLImageElement).src = tmp_pfp;
      setPFP(tmp_pfp);
      await drawShareImage(user, tmp_pfp);
    }

    const drawShareImage = async (user: _profile_user, tmp_pfp: string) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 710;
      canvas.height = 710;
      if (ctx) {
        ctx.fillStyle = "#f3f3f3";
        ctx.fillRect(0, 0, 860, 860);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 80px inter";
        ctx.fillText("↓", 60, 100);
        ctx.fillText(user.name, 60, 190);
        ctx.font = "bold 40px inter";
        ctx.fillText("の" + dict.share.box, 60, 250);
        // ctx.fillText(user.q_header, 70, 250);
        ctx.font = "normal 30px inter";
        wrapText(ctx, user.q_header, 60, 310, 560, 30);
        ctx.lineWidth = 3;
        roundedRect(ctx, 60, 350, 60, 60, 20, "↓", 0);
        roundedRect(ctx, 140, 350, 140, 60, 20, "----->", 0);
        roundedRect(ctx, 60, 430, 220, 60, 20, dict.share.askQuestion + "⟶", 0);
        roundedRect(ctx, 60, 510, 140, 140, 20, "↓----> ------> ->-->->↗", 0);
        roundedRect(ctx, 220, 510, 60, 60, 20, "↑", 0);
        roundedRect(ctx, 220, 590, 60, 60, 20, "⟶", 0);
        ctx.fillStyle = "black";
        ctx.fillRect(710 - 50, 0, 800, 800);
        roundedRect(ctx, 300, 350, 300, 300, 20, "", 0);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.font = "semibold 25px inter";
        ctx.fillStyle = "#7C7C7C";
        ctx.textAlign = "center";
        const { version } = require('../../../../../package.json');
        ctx.fillText(`提问の箱子 | ${version}`, 28, 340);
        ctx.restore();
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, 710, 710);
        const pathname = document.location.href;
        const qrCodeUrl = await generateQR(pathname.substring(0, pathname.length - 5) + "ask");
        // console.log(pathname.substring(0, pathname.length-64-1-5) + "ask");
        // console.log(document.location.href + user.name + "/ask");
        // const qrCodeUrl = await generateQR(document.location.hostname + user.name + "/ask");
        const qrcode = new Image();
        const logo = new Image();
        const pfpImage = new Image();
        let blob = await fetch(tmp_pfp).then(r => r.blob());
        // decode
        let dataUrl = await new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        let arr = (dataUrl as string).split(","),
          mime = arr[0].match(/:(.*?);/)![1],
          bstr = atob(arr[arr.length - 1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const ufile = new File([u8arr], username + ".png", { type: mime });
        // console.log(ufile);
        pfpImage.src = URL.createObjectURL(ufile);
        qrcode.src = qrCodeUrl;
        logo.src = "/grey7c7c7c_nobg.svg";
        const proms = [
          new Promise(res => logo.onload = () => res("logo")),
          new Promise(res => qrcode.onload = () => res("qrcode")),
          new Promise(res => pfpImage.onload = () => res("pfpImage")),
        ];
        Promise.all(proms).then(_ => {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.drawImage(logo, -150, 315, 35, 35);
          // console.log("draw");
          ctx.restore();
          ctx.drawImage(qrcode, 310, 360, 280, 280);
          ctx.drawImage(pfpImage, 500, 40, 100, 100);
          setShareSrc(canvas.toDataURL("image/jpg"));
        }
        );
      }
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

  const dict = useDictionary();

  function formatNewline(val: string) {
    return val.split(/\n/).map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>);
  }
  return (
    <>
      <Metadata title={`${name} ${dict.share.sharingBox} │ ${dict.questionBox}`} description="" />
      <main className="bg-white min-h-screen">
        <div className="flex justify-center ">
          <div className="-border border-black max-w-[440px] w-3/4">
            <Header title={name} subtitle={dict.share.sharingBox} url={pfp} />
            <div className="pt-4 pb-2">
              {dict.share.shareImage}
            </div>
            <IMAGE id="qr_code" className="w-full mt-2 mb-4 grayshadow" width={360} height={360} src={shareSrc} alt="Share QR code" />
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="-border border-black max-w-[440px] w-3/4">
            <div className="flex mb-8">
              <div className="w-1/2 -border flex gap-4">
                <Button fg="white" bg="black" shadow="darkgray" onclick={() => router.back()}>
                  <div className="py-3 px-3 leading-4 font-semibold">
                    <div>
                      {dict.share.back}
                      <br />
                      ⟵-
                    </div>
                  </div>
                </Button>
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" link="answer">
                  <div className="py-3 px-3 leading-4 font-semibold">
                    <div>
                      {formatNewline(dict.share.checkInbox)}
                    </div>
                  </div>
                </Button>
                <Button fg="white" bg="black" shadow="darkgray" link="profile">
                  <div className="py-3 px-3 leading-4 font-semibold">
                    <div>
                      {formatNewline(dict.share.profile)}
                    </div>
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
