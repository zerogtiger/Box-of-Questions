"use client"

import { faGlobe, faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDictionary } from "@/app/[lang]/dictionaryProvider";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import { ScriptProps } from "next/script";

export default function LangSwitcher() {

  const path = usePathname();
  const dict = useDictionary();

  let lang = "zh";
  if (path.indexOf("/en/") >= 0) {
    lang = "en";
  }

  const getOtherLang = (currLang: string) => {
    if (currLang === "en") {
      return "zh";
    }
    else {
      return "en";
    }
  }

  return (
    <Link href={path.replace("/" + lang + "/", "/" + getOtherLang(lang!) + "/")} >
      <FontAwesomeIcon icon={faGlobeAfrica} /> {dict.switchLang}
    </Link>
  )

}
