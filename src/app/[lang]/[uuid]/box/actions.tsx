"use server"
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache"
import { promisify } from 'util';

const prisma = new PrismaClient()

export type _box_user = {
  id: number;
  name: string;
  box_open: boolean;
};

export type _box_qa = {
  question: string;
  answer: string;
};

export async function _box_getQA(uid: number) {
  const qaDataNull: _box_qa[] | void = await prisma.questions.findMany({
    where: {
      uid: uid,
      answer: "",
      posted: true,
    },
    select: {
      question: true,
      answer: true,
    },
    orderBy: {
      time: 'desc',
    },
  }).catch((e) => { console.log(e) });
  const qaDataNNull: _box_qa[] | void = await prisma.questions.findMany({
    where: {
      uid: uid,
      NOT: {
        answer: "",
      },
      posted: true,
    },
    select: {
      question: true,
      answer: true,
    },
    orderBy: {
      time: 'desc',
    },
  }).catch((e) => { console.log(e) });
  return (qaDataNNull as _box_qa[]).concat((qaDataNull as _box_qa[]));
}

export async function _box_getUserInfo(username: string) {
  const userinfo: _box_user | void = await prisma.users.findFirstOrThrow({
    where: { username: username },
    select: {
      id: true,
      name: true,
      box_open: true,
    },
  }).catch((e) => { console.log(e) });
  return userinfo as _box_user;
}
