"use client";
import { ThemeContext } from "@/lib/context";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { Inter } from "next/font/google";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faGithub, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Brightness } from "@/components/ui/dark-to-light";
import NavProfile from "@/components/ui/nav-profile";
import { User } from "@prisma/client";
const inter = Inter({ subsets: ["latin"] });


interface NavBaseProps {
  href: string;
}

interface NavLinkProps extends NavBaseProps {
  text: string;
}

interface NavIconProps extends NavBaseProps {
  icon: IconDefinition;
}

function NavLink({ href, text }: NavLinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-xl")}>
          {text}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

function NavIcon({ href, icon }: NavIconProps) {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink target="_blank" className={cn(navigationMenuTriggerStyle(), "px-2 block")}>
          <FontAwesomeIcon icon={icon} className="!h-8 !align-middle" />
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

export default function RootLayoutComponent({
  user,
  children,
  initialMode
}: Readonly<{
  user?: User;
  children: React.ReactNode;
  initialMode: boolean
}>) {
  const [mode, setMode] = useState<boolean>(initialMode);
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <html lang="en" className={mode ? "dark" : ""}>
        <body className={cn(inter.className, "flex flex-col min-h-screen m-0 bg-sky-50 dark:bg-[#101720]")}>
          <div className="hidden md:flex justify-center p-3 sticky top-0 z-[49] w-full">
            <NavigationMenu className="border p-2 rounded-md bg-white dark:bg-gray-900">
              <NavigationMenuList>
                <NavLink href="/" text="Home" />
                <NavLink href="/team" text="Our Team" />
                {user ? (
                  <>
                    <NavLink href="/resources" text="Resources" />
                    {user.admin && <NavLink href="/admin" text="Admin" />}
                  </>
                ) : (
                  <>
                    <NavLink href="https://forms.gle/oL1gFnqQoqRPcb3q9" text="Sign Up" />
                    <NavLink href="https://discord.com/oauth2/authorize?client_id=1274686791542116404&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth2&scope=identify" text="Log In" />
                  </>
                )}
                <div className="!mx-2 text-gray-300 text-xl select-none">|</div>
                <NavIcon href="https://www.youtube.com/channel/UCjfxHo66lLDIZ3jgbsxDtAQ" icon={faYoutube} />
                <NavIcon href="https://github.com/spoi-org/" icon={faGithub} />
                <NavIcon href="https://www.linkedin.com/company/shortest-path-to-ioi" icon={faLinkedin} />
                <div className="!mx-2 text-gray-300 text-xl select-none">|</div>
                {user ?
                <NavProfile ssid={user} />
                : <Brightness />
                }
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="mb-10 flex flex-col flex-grow h-full">
            {children}
          </div>
          {!user && <footer className="bg-sky-100 w-full text-center p-5 text-2xl dark:bg-gray-700 flex items-center justify-center">
            <span className="pr-5">Ready to join?</span>
            <Button><Link href="https://forms.gle/oL1gFnqQoqRPcb3q9">Sign Up</Link></Button>
          </footer>}
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
