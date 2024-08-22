import "./globals.css";
import { findUserBySessionId } from "@/lib/utils.server";
import LayoutComponent from "./component";
import { cookies } from "next/headers";
import { UserContext } from "@/lib/context";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await findUserBySessionId();
  const cookieStore = cookies();
  return (
    <UserContext.Provider value={user || null}>
      <LayoutComponent initialMode={cookieStore.get("mode")?.value === "true"}>{children}</LayoutComponent>
    </UserContext.Provider>
  );
}
