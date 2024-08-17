"use client"

import { NavigationMenuItem } from "@radix-ui/react-navigation-menu"
import { navigationMenuTriggerStyle } from "./navigation-menu"
import { cn } from "@/lib/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun } from "@fortawesome/free-solid-svg-icons"

export default function Brightness() {
    return <NavigationMenuItem>
    <div className={cn(navigationMenuTriggerStyle(), "px-2")}  onClick={()=>{document.querySelector("html")?.classList?.toggle("dark")}}>
        <FontAwesomeIcon icon={faSun} className="w-full h-full cursor-pointer"/>
    </div>
    </NavigationMenuItem>
} 