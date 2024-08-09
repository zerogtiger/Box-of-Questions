"use server"
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'

import { cookieHash } from '@/components/hash';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getDictionary } from '../dictionaries';

const prisma = new PrismaClient()
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export type _login_user = {
  id: number;
  name: string;
  password: string;
};

export async function _login_getDict(lang: string) {
  const dict = await getDictionary(lang); // en
  return dict;
}

export async function _login_getCookies() {
  try {
    const id = Number(cookies().get("id")?.value);
    const key = cookies().get("key")?.value;
    // console.log("id: ", id);
    // console.log("key: ", key);
    if (id) {
      const key_s = await prisma.users.findFirstOrThrow({
        where: {
          id: id,
        },
        select: {
          cookie_key: true,
        }
      }).catch((e: PrismaClientKnownRequestError) => {
        if (e.message === "No users found") {
          console.log(e.message);
          return null;
        }
        else {
          console.log(e);
          return null;
        }
      });
      if (key_s && key_s.cookie_key && key_s.cookie_key === key) {
        const newKey = cookieHash(id);
        const result = await prisma.users.update({
          where: {
            id: id
          },
          data: {
            cookie_key: newKey,
          },
          select: {
            username: true,
          }
        });
        cookies().set("key", newKey);
        return result?.username;
      }
      else {
        return null;
      }
    }
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

export async function _login_createCookie(id: number) {
  // create cookie to store on user's device
  cookies().delete("id");
  cookies().delete("key");
  const expire = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  cookies().set({
    name: "id",
    value: id.toString(),
    path: "/",
    expires: expire,
  });
  const newKey = cookieHash(id);
  await prisma.users.update({
    where: {
      id: id
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
}

export async function _login_deleteCookie() {
  // console.log("deleted");
  cookies().delete("id");
  cookies().delete("key");
}

export async function _login_loginable(username: string, password: string) {
  const newUser = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
      password: password,
    },
    select: {
      id: true,
    }
  }).catch((e: PrismaClientKnownRequestError) => {
    if (e.message === "No users found") {
      console.log(e.message);
      return null;
    }
    else {
      console.log(e);
      return null;
    }
  });
  return newUser?.id;
}

export async function _login_registerable(name: string, username: string, password: string) {
  let exist = true;
  const newUser = await prisma.users.findFirstOrThrow({
    where: {
      username: username,
    },
  }).catch((e: PrismaClientKnownRequestError) => {
    if (e.message === "No users found") {
      exist = false;
    }
    else {
      console.log(e);
      return null;
    }
  });
  if (!(exist === true)) {
    const result = await prisma.users.create({
      data: {
        name: name,
        username: username,
        password: password,
        q_header: "请提问",
        q_open: true,
        box_open: false,
      },
      select: {
        id: true,
      },
    }).catch((e: any) => console.log(e));
    return result?.id;
  }
  return null;
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

