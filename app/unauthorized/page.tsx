import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized(){
  return (
    <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
      <h1 className="text-4xl font-extrabold">You are not a member</h1>
      <p className="text-xl">Please sign up for the program and get verified in the discord server before logging in.</p>
        <Link href="/">
          <Button className="text-lg">
            Back to Home
          </Button>
        </Link>
    </div>
  );
}