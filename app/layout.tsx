import "./globals.css";
import { findUserBySessionId } from "@/lib/utils.server";
import LayoutComponent from "./component";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = findUserBySessionId();
  const cookieStore = cookies();
  return (
    <LayoutComponent user={user} initialMode={cookieStore.get("mode")?.value === "true"} url={process.env.URL!}>
      {children}
    </LayoutComponent>
  );
}
