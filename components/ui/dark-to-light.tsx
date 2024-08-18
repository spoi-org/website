"use client"

import { NavigationMenuItem } from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "./navigation-menu"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { getCookie, setCookie } from 'cookies-next'

export function Brightness() {
    let [state, setState]  = useState<boolean>(false);
    useEffect(()=> {
        setState(getCookie("mode") == "true")
    }, [])
    return (
        <NavigationMenuItem>
            <div className={cn(navigationMenuTriggerStyle(), "px-2")}  onClick={()=>{
                document.querySelector("html")?.classList?.toggle("dark")
                setCookie("mode", !state + "");
                setState(!state);
            }}>
                <FontAwesomeIcon icon={state ? faMoon : faSun} className="!h-8 cursor-pointer"/>
            </div>
        </NavigationMenuItem>
    );
}

export function BrightnessText(){
    let [state, setState] = useState<boolean>(false);
    useEffect(() => setState(getCookie("mode") == "true"), []);
    return (
        <div className="cursor-pointer flex justify-center items-center font-bold w-full text-base" onClick={()=>{
            document.querySelector("html")?.classList?.toggle("dark")
            setCookie("mode", !state + "");
            setState(!state);
        }}>
            <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={state ? faMoon : faSun} className="fa-1x mr-1"/>
                <span>{state ? "Dark Mode" : "Light Mode"}</span>
            </div>
        </div>
    )
}