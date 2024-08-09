"use server"
import { revalidatePath } from "next/cache"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type _ask_user = {
  id: number;
  name: string;
  q_header: string;
  q_open: boolean;
  post_new: boolean;
};

export async function _ask_submitData(uid: number, question: string, post: boolean) {
  const date = new Date();
  const userinfo = await prisma.questions.create({
    data: {
      uid: uid,
      question: question,
      answer: "",
      time: date,
      posted: post,
    },
  }).catch((e) => { console.log(e) });
}

export async function _ask_getData(username: string) {
  const userinfo: _ask_user | void = await prisma.users.findFirstOrThrow({
    where: { username: username },
    select: {
      id: true,
      name: true,
      q_header: true,
      q_open: true,
      post_new: true,
    },
  }).catch(() => { });
  return userinfo as _ask_user;
}
