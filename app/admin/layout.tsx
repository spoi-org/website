
import { Button } from "@/components/ui/button";
import { findUserBySessionId } from "@/lib/utils.server";
import Link from "next/link";
export default async function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
  }>) {
  let user = await findUserBySessionId();
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
  if (!user.admin){
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow gap-y-3">
        <h1 className="text-4xl font-extrabold">You are not an admin</h1>
        <p className="text-xl">Please log in as an admin to access this page</p>
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