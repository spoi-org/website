import { cache } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { getBody } from "../utils";
import { checkAdmin } from "../../utils";

export async function PATCH(req : Request, { params } : { params: { id: string } }) {
    const admin = checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await cache.problem.update(params.id, { data: body });
    } catch (e){
        return NextResponse.json({
            error: "Problem not found"
        }, { status: 404 });
    }
    return NextResponse.json({
        success: true
    });
}

export async function DELETE(req: Request, { params } : { params: { id: string } }) {
    const admin = checkAdmin();
    if (admin) return admin;
    try {
        await cache.problem.delete(params.id);
    } catch (e){
        return NextResponse.json({
            error: "Problem not found"
        }, { status: 404 });
    }
    return NextResponse.json({
        success: true
    });
}