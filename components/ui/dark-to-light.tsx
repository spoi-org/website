"use client"

import { NavigationMenuItem } from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "./navigation-menu"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { getCookie, setCookie } from 'cookies-next'

export default function Brightness() {
    let [state, setState]  = useState<boolean>(false);
    useEffect(()=> {
        setState(getCookie("mode") == "true")
    }, [])
    return <NavigationMenuItem>
    <div className={cn(navigationMenuTriggerStyle(), "px-2")}  onClick={()=>{
        document.querySelector("html")?.classList?.toggle("dark")
        setCookie("mode", !state + "");
        setState(!state);
    }}>
        
        <FontAwesomeIcon icon={state ? faMoon : faSun} className="!h-7 cursor-pointer"/>
    </div>
    </NavigationMenuItem>
} 