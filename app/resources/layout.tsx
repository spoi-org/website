"use client";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/lib/context";
import Link from "next/link";
import { useContext } from "react";

export default function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
  }>) {
  const user = useContext(UserContext);
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
        <h1 className="text-4xl font-extrabold">You are not logged in</h1>
        <p className="text-xl">Please log in to access this page</p>
          <Link href="/">
            <Button className="text-lg">
              Back to Home
            </Button>
          </Link>
      </div>
    );
  }
  return children;
}