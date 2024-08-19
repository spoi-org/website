"use client";
import { BrightnessText } from "@/components/ui/dark-to-light";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface NavProfileProps {
  ssid: User
};

export default function NavProfile({ ssid } : NavProfileProps){
  const router = useRouter();
  function logOut(){
    document.cookie = "__ssid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.refresh();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 outline-none hover:outline-none focus:outline-none">
          <img src={ssid.avatar} className="h-10 rounded-full hover:brightness-90 transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <DropdownMenuLabel className="text-base text-center">{ssid.dcUserName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <BrightnessText />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-center items-center text-base text-red-900 dark:text-red-300 font-bold cursor-pointer" onClick={logOut}>
          <FontAwesomeIcon className="mr-1" icon={faArrowRightFromBracket} />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent> 
    </DropdownMenu>
  )
}