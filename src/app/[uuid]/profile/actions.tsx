"use server"
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from "next/cache"
import { decode } from 'base64-arraybuffer';
import { promisify } from 'util';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export type _profile_user = {
  id: number;
  name: string;
  box_open: boolean;
  q_open: boolean;
  post_new: boolean;
  q_header: string;
};

export async function _profile_getPFPURL(username: string) {
  if (username === "") return "";
  const { data, error } = await supabase.storage
    .from('user_pfp')
    .list();

  if (error) {
    console.log(error.message)
  };
  const mapped = data?.map(pfp => pfp.name.substring(0, pfp.name.length - 4));
  if (mapped?.includes(username)) {

    const date = new Date();
    const ret = supabase.storage.from("user_pfp").getPublicUrl(username + ".png")!.data.publicUrl + "?" + date.toISOString();
    console.log(ret);
    return ret;
  }
  return "/grey7c7c7c_nobg.svg"
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

export async function _profile_deleteAccount(username: string) {
  const status = await prisma.users.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    }
  }).catch(e => { throw new Error(e.message) });

  const delQuestions = await prisma.questions.deleteMany({
    where: {
      uid: status?.id,
    }
  }).catch(e => console.log(e));

  const delPFP = await supabase.storage.from("user_pfp").remove([username + ".png"]).catch(e => console.log(e));

  const delUser = await prisma.users.delete({
    where: {
      id: status?.id,
    }
  }).catch(e => console.log(e));
}

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

// export async function _profile_checkPassword(username: string) {
//   const cid = cookies().get("id")?.value;
//   const ckey = cookies().get("key")?.value;
//
//   if (!(cid || ckey)) {
//     return false;
//   }
//   const currUser = await prisma.users.findUnique({
//     where: {
//       username: username,
//     },
//     select: {
//       id: true,
//       cookie_key: true,
//     },
//   });
//   if (currUser?.cookie_key === ckey && currUser?.id.toString() === cid) {
//     return true;
//   }
//   return false;
// }

export async function _profile_togglePostNew(id: number, post_new: boolean) {
  const newUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      post_new: post_new,
    },
  }).catch((e) => { console.log(e) });
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
      post_new: true,
      q_header: true
    },
  }).catch((e) => { console.log(e) });
  return userinfo as _profile_user;
}
