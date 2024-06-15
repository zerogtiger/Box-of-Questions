"use server"
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache"
import { _profile_user } from '../profile/actions';
import { use } from 'react';
import { cookies } from 'next/headers';
import { cookieHash } from '@/components/hash';

const prisma = new PrismaClient()

export type _answer_user = {
  id: number;
  name: string;
  box_open: boolean;
};

export type _answer_qa = {
  id: number;
  question: string;
  answer: string;
  posted: boolean;
};

export async function _answer_clearBox(uid: number) {
  console.log(uid);
  const result = await prisma.questions.deleteMany({
    where: {
      uid: uid,
    },
  });
}

export async function _answer_checkPassword(username: string) {
  try {
    const cid = cookies().get("id")?.value;
    const ckey = cookies().get("key")?.value;
    console.log(cid);
    console.log(ckey);

    if (!(cid || ckey)) {
      console.log(1);
      return false;
    }
    console.log(2);
    const currUser = await prisma.users.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        cookie_key: true,
      },
    });
    console.log(3);
    console.log(currUser);
    if (currUser && currUser?.cookie_key === ckey && currUser?.id.toString() === cid) {
      cookies().delete("id");
      cookies().delete("key");
      const expire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      const id = currUser.id;
      cookies().set({
        name: "id",
        value: id.toString(),
        path: "/",
        expires: expire,
      });
      const newKey = cookieHash(currUser.id);
      await prisma.users.update({
        where: {
          id: id,
        },
        data: {
          cookie_key: newKey,
        },
      });
      cookies().set({
        name: "key",
        value: newKey,
        path: "/",
        expires: expire,
      });

      console.log(4);
      return true;
    }
    console.log(5);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function _answer_changePosted(uid: number, qid: number, posted: boolean) {
  const _ = await prisma.questions.update({
    where: {
      id: qid,
    },
    data: {
      posted: posted,
    },
  });
}

export async function _answer_answer(uid: number, qid: number, answer: string) {
  const _ = await prisma.questions.update({
    where: {
      id: qid,
    },
    data: {
      answer: answer,
    },
  });
}

export async function _answer_remove(uid: number, qid: number) {
  const _ = await prisma.questions.delete({
    where: {
      id: qid,
    }
  })
}

export async function _answer_getQA(uid: number) {
  const qaDataNull: _answer_qa[] | void = await prisma.questions.findMany({
    where: {
      uid: uid,
      answer: "",
    },
    select: {
      id: true,
      question: true,
      answer: true,
      posted: true,
    },
    orderBy: {
      time: 'desc',
    },
  }).catch((e) => { console.log(e) });

  const qaDataNNull: _answer_qa[] | void = await prisma.questions.findMany({
    where: {
      uid: uid,
      NOT: {
        answer: "",
      }
    },
    select: {
      id: true,
      question: true,
      answer: true,
      posted: true,
    },
    orderBy: {
      time: 'desc',
    },
  }).catch((e) => { console.log(e) });
  // console.log((qaDataNNull as _answer_qa[])[0].answer === null);
  // console.log(qaData);
  return (qaDataNull as _answer_qa[]).concat(qaDataNNull as _answer_qa[]);
}

export async function _answer_getUserInfo(username: string) {
  const userinfo: _answer_user | void = await prisma.users.findFirstOrThrow({
    where: { username: username },
    select: {
      id: true,
      name: true,
      box_open: true,
    },
  }).catch((e) => { console.log(e) });
  return userinfo as _answer_user;
}
