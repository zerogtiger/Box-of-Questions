"use server"
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache"
import { _profile_user } from '../profile/actions';
import { use } from 'react';

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


export async function _answer_checkPassword(username: string, password: string) {
  const currUser = await prisma.users.findUnique({
    where: {
      username: username,
    },
    select: {
      password: true,
    },
  });
  if (currUser?.password === password) {
    return true;
  }
  return false;
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
