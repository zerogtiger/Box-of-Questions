"use client"
import Button from "@/components/button";
import Header from "@/components/header";
import TextDisplay from "@/components/textdisplay";
import Indicator from "@/components/indicator";
import TextField from "@/components/textfield";
import { useEffect, useState } from "react";
import { _answer_answer, _answer_changePosted, _answer_checkPassword, _answer_clearBox, _answer_getQA, _answer_getUserInfo, _answer_qa, _answer_remove, _answer_user } from "./actions";
import { useRouter } from "next/navigation";
import { _profile_deleteAccount, _profile_getPFPURL } from "../profile/actions";
import { _login_deleteCookie } from "@/app/login/actions";

export default function Answer({ params }: { params: { uuid: string } }) {

  const [name, setName] = useState<string>("◻️◻️◻️◻️◻️◻️");
  const [id, setId] = useState<number>(-1); // user id

  const [qa, setqa] = useState<_answer_qa[]>([]);
  const [ind, setInd] = useState<string[]>([]); // array of indicator light colors
  const [posted, setPosted] = useState<number[]>([]);
  const [focus, setFocus] = useState<number | undefined>(undefined); // currently editing
  const [confirmDel, setConfirmDel] = useState<number | undefined>(undefined);

  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const [answer, setAnswer] = useState<string[]>([]); // array of new answers

  const [pfp, setPFP] = useState<string>("");

  const username = params.uuid;

  const router = useRouter();

  useEffect(() => { /* initial data retrival */
    const updateData = async () => {

      // user info
      const user: _answer_user = await _answer_getUserInfo(username);
      setId(user.id);
      setName(user.name);

      // qa pairs
      const qaData: _answer_qa[] = await _answer_getQA(user.id);
      setqa(qaData);

      // indicators
      const _ind = qaData.map((_ele, _idx) => {
        return "lightgreen"
      });
      setInd(_ind);

      // posted
      const _posted: number[] = qaData.map((ele, idx) => {
        return ele.posted === true ? 1 : -1;
      });
      setPosted(_posted);

      // answers
      const _answer: string[] = qaData.map((ele, idx) => {
        return ele.answer;
      });
      setAnswer(_answer);

      const tmp_pfp = await _profile_getPFPURL(username);
      setPFP(tmp_pfp);
    };

    const verifyPassword = async () => {
      const verdict = await _answer_checkPassword(username);
      if (verdict === true) {
        console.log("in");
        updateData();
        return;
      }
      else {
        await _login_deleteCookie();
        router.push("/login");
        return;
      }
    }

    verifyPassword();
  }, []);

  // if answers change
  useEffect(() => {
    // if changed
    if (focus !== undefined && qa[focus].answer !== answer[focus]) {
      // new indicator colors
      const _ind = ind.map((ele, idx) => {
        // changed
        if (idx === focus) {
          return "yellow";
        }
        else {
          return ele;
        }
      });
      setInd(_ind);
    }
    // if unchanged
    else {
      const _ind = ind.map((ele, idx) => {
        if (idx === focus) {
          return "lightgreen";
        }
        else {
          return ele;
        }
      })
      setInd(_ind);
    }
  }, [answer, qa]);

  // left button
  const deleteQuestion = async (idx: number) => {
    // if unfocusing
    if (focus === idx) {
      const _answer = answer.map((_ele, _idx) => {
        if (_idx === idx) {
          return qa[idx].answer;
        }
        else {
          return _ele;
        }
      });
      setAnswer(_answer);
      setFocus(undefined);
      const _ind = ind.map((_ele, _idx) => {
        if (_idx === idx) {
          return "lightgreen";
        }
        else {
          return _ele;
        }
      })
      setInd(_ind);
    }
    // otherwise, toggle delete
    else if (confirmDel !== idx) {
      const _ind = ind.map((_ele, _idx) => {
        if (_idx === idx) {
          return "darkred";
        }
        else {
          return _ele;
        }
      });
      setInd(_ind);
      setConfirmDel(idx);
    }
    // otherwise, cancel delete
    else {
      const _ind = ind.map((_ele, _idx) => {
        if (_idx === idx) {
          return (answer[idx] === qa[idx].answer ? "lightgreen" : "yellow");
        }
        else {
          return _ele;
        }
      });
      setConfirmDel(undefined);
      setInd(_ind);
    }
  }

  // right button
  const editAnswer = async (idx: number) => {
    // delete question
    if (confirmDel === idx) {
      await _answer_remove(id, qa[idx].id);
      setInd(ind.filter((_ele, _idx) => _idx !== idx));
      setqa(qa.filter((_ele, _idx) => _idx !== idx));
      setConfirmDel(undefined);
    }
    // confirm change
    else if (idx === focus) {
      let _ind = ind.map((_ele, _idx) => {
        if (_idx === idx) {
          return "yellow";
        }
        else {
          return _ele;
        }
      });
      setInd(_ind);
      await _answer_answer(id, qa[idx].id, answer[idx]);
      const _qa = qa.map((_ele, _idx) => {
        if (_idx === idx) {
          const ans: _answer_qa = _ele;
          ans.answer = answer[idx];
          return ans;
        }
        else {
          return _ele;
        }
      });
      setFocus(undefined);
      setqa(_qa);
      _ind = ind.map((_ele, _idx) => {
        if (_idx === idx) {
          return "lightgreen";
        }
        else {
          return _ele;
        }
      });
      setInd(_ind);
    }
    else {
      setFocus(idx);
    }
  }

  const togglePosted = async (idx: number) => {
    let _posted = posted.map((_ele, _idx) => {
      if (_idx === idx) {
        return 0;
      }
      else {
        return _ele;
      }
    });
    setPosted(_posted);

    const newPosted: number = qa[idx].posted ? -1 : 1;

    await _answer_changePosted(id, qa[idx].id, !qa[idx].posted);

    const _qa = qa.map((_ele, _idx) => {
      if (_idx === idx) {
        const ans: _answer_qa = _ele;
        ans.posted = !ans.posted;
        return ans;
      }
      else {
        return _ele;
      }
    });
    setqa(_qa);

    _posted = posted.map((_ele, _idx) => {
      if (_idx === idx) {
        return newPosted;
      }
      else {
        return _ele;
      }
    });
    setPosted(_posted);
  }

  const clearBox = () => {
    if (confirmClear === true) {
      setConfirmClear(false);
    }
    else {
      setConfirmClear(true);
    }
  }

  const boxSettings = async () => {
    if (confirmClear === true) {
      await _answer_clearBox(id);
      setqa([]);
      setInd([]);
      setPosted([]);
      setFocus(undefined);
      setConfirmDel(undefined);
      setAnswer([]);
      setConfirmClear(false);
    }
    else {
      router.push("profile");
    }
  }

  const setAnsIdx = (idx: number, newAnswer: string) => {
    const _answer = answer.map((_ele, _idx) => {
      if (_idx === idx) {
        return newAnswer;
      }
      else {
        return _ele;
      }
    });
    setAnswer(_answer);
  }

  const logOut = async () => {
    // console.log("hi");
    await _login_deleteCookie();
    router.replace("/login");
    return;
  }

  return (
    <main className="bg-white flex justify-center min-h-screen">
      <div className="-border border-black max-w-[440px] w-3/4">
        <Header title={name} subtitle="查看箱子ING" url={pfp} />
        <div className="flex mt-2 mb-4">
          <div className="w-1/2 -border flex gap-4 font-bold text-[40px] leading-snug">
            ↓
          </div>
          <div className=" w-1/2 justify-end -border flex gap-3">
            <Button fg="white" bg="black" shadow="darkgray" link="share">
              <div className="-border py-3 px-3 leading-4 font-semibold">
                分享
                <br />
                箱子
              </div>
            </Button>
            <Button fg="white" bg="black" shadow="darkgray" link="profile">
              <div className="-border py-3 px-3 leading-4 font-semibold">
                设置
                <br />
                箱子
              </div>
            </Button>
          </div>
        </div>

        {qa.map((ele: _answer_qa, key: number) => {
          return [
            <TextDisplay>
              <p className="text-[#AAAAAA] my-1">
                有人问：
              </p>
              <p className="text-black my-2 leading-[18px] whitespace-pre-wrap">
                {ele.question}
              </p>
              {focus === key ?
                [
                  <p className="text-start text-[#AAAAAA] my-1">
                    您答说：
                  </p>,
                  <TextField maxChar={1000} placeholder="您的回答" rows={5} text={answer[key]} setText={(ans: string) => setAnsIdx(key, ans)} />
                ]
                : ele.answer ? [
                  <p className="text-end text-[#AAAAAA] my-1">
                    您回答说：
                  </p>,
                  <p className="text-end text-black my-2 leading-[18px]">
                    {ele.answer}
                  </p>,
                  (ele.answer !== answer[key] ? [
                    <p className="text-end text-[#AAAAAA] my-1">
                      但您准备说：
                    </p>,
                    <p className="text-end text-[#888888] my-2 leading-[18px]">
                      {answer[key]}
                    </p>]
                    :
                    ""
                  )] :
                  answer[key] ? [
                    <p className="text-end text-[#AAAAAA] my-1">
                      您准备回答：
                    </p>,
                    <p className="text-end text-[#888888] my-2 leading-[18px]">
                      {answer[key]}
                    </p>
                  ] :
                    [
                      <p className="text-end text-[#AAAAAA] my-1">
                        您未回答。
                      </p>
                    ]
              }
            </TextDisplay>,
            <div className="flex mb-3">
              <div className="w-1/2 flex">
                <Button
                  fg={confirmDel === key || focus === key ? "white" : "black"}
                  bg={confirmDel === key || focus === key ? "darkgreen" : "white"}
                  shadow={confirmDel === key || focus == key ? "black" : "darkred"}
                  onclick={() => deleteQuestion(key)}>
                  <div className="py-[1px] px-4">
                    {confirmDel === key || focus === key ? "← 取消" : "删除↑"}
                  </div>
                </Button>
              </div>
              <div className="w-1/2 flex justify-end gap-3">
                <Indicator color={ind[key]} />
                <Button
                  fg={confirmDel === key ? "white" : "white"}
                  bg={confirmDel === key ? "darkred" : "black"}
                  shadow={confirmDel === key ? "black" : "darkgray"}
                  onclick={() => editAnswer(key)}>
                  <div className="py-[1px] px-4">
                    {confirmDel === key ? "确认↑" : focus === key ? "保存↑" : (ele.answer ? "修改↑" : "回答↑")}
                  </div>
                </Button>
              </div>
            </div>,
            <div className="-border flex mt-2 mb-5 h-fit">
              <div className="w-1/2 -border gap-4 font-bold text-2xl flex items-end">
                <Indicator color={posted[key] === 1 ? "lightgreen" : "gray"} />
                <Indicator color={posted[key] === 0 ? "yellow" : "gray"} />
                <Indicator color={posted[key] === -1 ? "lightred" : "gray"} />
              </div>
              <div className=" w-1/2 justify-end -border flex gap-3">
                <Button fg="white" bg="black" shadow="darkgray" onclick={() => togglePosted(key)}>
                  <div className="px-3 leading-6 font-semibold">
                    ⟵ 隐藏 / 发布
                  </div>
                </Button>
              </div>
            </div>
          ]
        })}
        <div className="text-center text-sm my-6 text-[#AAAAAA]">
          到底啦，没有更多问题啦！
        </div>
        <div className="flex mb-8">
          <div className="w-1/2 -border flex gap-4">
            <Button fg={confirmClear ? "white" : "black"} bg={confirmClear ? "darkgreen" : "white"} shadow={confirmClear ? "black" : "darkred"} onclick={clearBox}>
              <div className="py-3 px-3 leading-4 font-semibold">
                {confirmClear ?
                  <div>
                    取消
                    < br />
                    ⟵-
                  </div>
                  :
                  <div>
                    清空
                    <br />
                    箱子
                  </div>
                }
              </div>
            </Button>
            <Button fg="black" bg="white" shadow="darkred" onclick={logOut}>
              <div className="py-3 px-3 leading-4 font-semibold">
                退出
                <br />
                登录
              </div>
            </Button>
          </div>
          <div className=" w-1/2 justify-end -border flex gap-3">
            <Button fg="white" bg="black" shadow="darkgray" link="share">
              <div className="-border py-3 px-3 leading-4 font-semibold">
                分享
                <br />
                箱子
              </div>
            </Button>
            <Button fg="white" bg={confirmClear ? "darkred" : "black"} shadow={confirmClear ? "black" : "darkgray"} onclick={boxSettings}>
              <div className="py-3 px-3 leading-4 font-semibold">
                {confirmClear ?
                  <div>
                    确认
                    < br />
                    ⟶-
                  </div>
                  :
                  <div>
                    设置
                    <br />
                    箱子
                  </div>}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

