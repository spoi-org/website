import { cache } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { checkAdmin } from "../utils";

export async function GET(request: Request) {
    const admin = checkAdmin();
    if (admin) return admin;
    let params = new URL(request.url).searchParams;
    const skip = (+(params.get("skip") as string) || 0)*50;
    if (skip < 0)
        return NextResponse.json([]);
    return NextResponse.json(cache.user.all().slice(skip, skip+50));
}
