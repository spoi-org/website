import { NextResponse } from "next/server";
import { getBody } from "./utils";
import { cache } from "@/lib/utils.server";
import { checkAdmin } from "../utils";

export async function POST(req : Request) {
    const admin = checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await cache.topic.insert({
            data: {
                name: body.name,
                id: body.id,
                categoryId: body.categoryId
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Topic already exists"
        }, {status: 400});
    }
    return NextResponse.json({
        success: true
    });
}