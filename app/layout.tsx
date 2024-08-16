import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPOI",
  description: "Training program for Indian students preparing for the International Olympiad in Informatics",
};

interface NavBaseProps {
  href: string;
}

interface NavLinkProps extends NavBaseProps {
  text: string;
}

interface NavIconProps extends NavBaseProps {
  icon: IconDefinition;
}

function NavLink({ href, text } : NavLinkProps){
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {text}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

function NavIcon({ href, icon } : NavIconProps){
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "px-2")}>
          <FontAwesomeIcon icon={icon} className="w-full h-full" />
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex justify-center p-3">
          <NavigationMenu className="border p-2 rounded-md">
            <NavigationMenuList>
              <NavLink href="/" text="Home" />
              <NavLink href="/team" text="Our Team" />
              <NavLink href="https://forms.gle/oL1gFnqQoqRPcb3q9" text="Sign Up" />
              <NavIcon href="https://www.youtube.com/channel/UCjfxHo66lLDIZ3jgbsxDtAQ" icon={faYoutube} />
              <NavIcon href="https://github.com/Shortest-Path-to-IOI/" icon={faGithub} />
              <NavIcon href="https://www.linkedin.com/company/shortest-path-to-ioi" icon={faLinkedin} />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {children}
      </body>
    </html>
  );
}
