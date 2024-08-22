"use client"

import { NavigationMenuItem } from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "./navigation-menu"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"
import { useContext } from "react";
import { setCookie } from 'cookies-next'
import { ThemeContext } from "@/lib/context"

export function Brightness() {
    const { mode, setMode }  = useContext(ThemeContext);
    return (
        <NavigationMenuItem>
            <div className={cn(navigationMenuTriggerStyle(), "px-2")}  onClick={()=>{
                setCookie("mode", !mode + "");
                console.log("setMode", !mode);
                setMode(!mode);
            }}>
                <FontAwesomeIcon icon={mode ? faMoon : faSun} className="!h-8 cursor-pointer"/>
            </div>
        </NavigationMenuItem>
    );
}

export function BrightnessText(){
    const { mode, setMode }  = useContext(ThemeContext);
    return (
        <div className="cursor-pointer flex justify-center items-center font-bold w-full text-base" onClick={()=>{
            setCookie("mode", !mode + "");
            console.log("setMode", !mode);
            setMode(!mode);
        }}>
            <div className="flex justify-center items-center">
                <FontAwesomeIcon icon={mode ? faMoon : faSun} className="fa-1x mr-1"/>
                <span>{mode ? "Dark Mode" : "Light Mode"}</span>
            </div>
        </div>
    )
}