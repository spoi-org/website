import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { findUserBySessionId, prisma } from "@/lib/utils.server";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    let user = await findUserBySessionId();
    if (!user || !user.admin) 
        return NextResponse.json([])
    let params = new URL(request.url).searchParams;
    if ((+(params.get("skip") as string) || 0)*50 < 0) {
        return NextResponse.json([])
    }
    return NextResponse.json(await prisma.user.findMany({skip: (+(params.get("skip") as string) || 0)*50, take:50}));




}
