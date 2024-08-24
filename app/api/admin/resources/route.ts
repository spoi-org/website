import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "./utils";
import { cache } from "@/lib/utils.server";

export async function POST(req : Request) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await cache.resourceItem.insert({
            data: {
                title: body.title,
                id: body.id,
                topicId: body.topicId,
                description: body.description,
                content: body.content || `This is the content for resource ${body.title}`
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Resource already exists"
        }, {status: 400});
    }
    return NextResponse.json({
        success: true
    });
}