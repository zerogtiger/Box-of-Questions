"use server"
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from "next/cache"
import { promisify } from 'util';

const prisma = new PrismaClient()
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export type _login_user = {
  id: number;
  name: string;
  password: string;
};

export async function _login_loginable(username: string, password: string) {
  let exist = true;
  const newUser = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
      password: password,
    },
  }).catch((e) => {
    if (e.message === "No users found") {
      exist = false;
      console.log(e.message);
    }
    else {
      console.log(e);
      return null;
    }
  });
  return exist;
}

export async function _login_registerable(name: string, username: string, password: string) {
  let exist: boolean = true;
  const newUser = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
    },
  }).catch((e) => {
    if (e.message === "No users found") {
      exist = false;
    }
    else {
      console.log(e);
      return null;
    }
  });
  if (!(exist === true)) {
    await prisma.users.create({
      data: {
        name: name,
        username: username,
        password: password,
        q_header: "请提问",
        q_open: true,
        box_open: false,
      }
    }).catch((e) => console.log(e));


  }
  return exist;
}

// export async function _login_login(username: string, password: string) {
//   const newUser = await prisma.users.update({
//     where: {
//       id: id,
//     },
//     data: {
//       q_open: q_Open,
//     },
//   }).catch((e) => { console.log(e) });
// }

// export async function _profile_toggleQOpen(id: number, q_Open: boolean) {
//   const newUser = await prisma.users.update({
//     where: {
//       id: id,
//     },
//     data: {
//       q_open: q_Open,
//     },
//   }).catch((e) => { console.log(e) });
// }
//
// export async function _profile_toggleBox(id: number, boxOpen: boolean) {
//   const newUser = await prisma.users.update({
//     where: {
//       id: id,
//     },
//     data: {
//       box_open: boxOpen,
//     },
//   }).catch((e) => { console.log(e) });
//   ;
// }
//
// export async function _profile_setNewName(id: number, name: string) {
//   const newUser = await prisma.users.update({
//     where: {
//       id: id,
//     },
//     data: {
//       name: name,
//     },
//   }).catch((e) => { console.log(e) });
// }
//
// export async function _profile_setNewPrompt(id: number, prompt: string) {
//   const newUser = await prisma.users.update({
//     where: {
//       id: id,
//     },
//     data: {
//       q_header: prompt,
//     },
//   }).catch((e) => { console.log(e) });
// }

