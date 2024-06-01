"use server"
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from "next/cache"
import { decode } from 'base64-arraybuffer';
import { promisify } from 'util';

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export type _profile_user = {
  id: number;
  name: string;
  box_open: boolean;
  q_open: boolean;
  q_header: string;
};

export async function _profile_reval() {
  revalidatePath("/");
}

export async function _profile_getPFPURL(username: string) {
  console.log("username");
  const ret = supabase.storage.from("user_pfp").getPublicUrl(username + ".png")!.data.publicUrl;
  revalidatePath("/");
  return ret;
}


// export async function _profile_uploadPFP(username: string, file: File) {
//   console.log("iah");
//   // const { error: uploadError } = await supabase.storage.from("user_pfp").upload("test.png", file);
//   // const { error: uploadError } = await supabase.storage.from("user_pfp").upload("test.png", url, {
//   //   // contentType: 'image/png',
//   //   // upsert: true,
//   // });
//   // if (uploadError) {
//   //   throw uploadError;
//   // } else {
//   //   console.log("in_else");
//   // }
//   // const val = supabase.storage.from("user_pfp").getPublicUrl("bitmap.png")!;
//   // console.log(val.data.publicUrl);
//   // revalidatePath("/");
// }

export async function _profile_updatePassword(username: string, password: string) {
  const currUser = await prisma.users.update({
    where: {
      username: username,
    },
    data: {
      password: password,
    }
  });
}

export async function _profile_checkPassword(username: string, password: string) {
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

export async function _profile_toggleQOpen(id: number, q_Open: boolean) {
  const newUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      q_open: q_Open,
    },
  }).catch((e) => { console.log(e) });
}

export async function _profile_toggleBox(id: number, boxOpen: boolean) {
  const newUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      box_open: boxOpen,
    },
  }).catch((e) => { console.log(e) });
  ;
}

export async function _profile_setNewName(id: number, name: string) {
  const newUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  }).catch((e) => { console.log(e) });
}

export async function _profile_setNewPrompt(id: number, prompt: string) {
  const newUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      q_header: prompt,
    },
  }).catch((e) => { console.log(e) });
}

export async function _profile_getUserInfo(username: string) {
  const userinfo: _profile_user | void = await prisma.users.findFirstOrThrow({
    where: { username: username },
    select: {
      id: true,
      name: true,
      box_open: true,
      q_open: true,
      q_header: true
    },
  }).catch((e) => { console.log(e) });
  return userinfo as _profile_user;
}
