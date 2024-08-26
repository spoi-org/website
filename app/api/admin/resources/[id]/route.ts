import { cache } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "../utils";

export async function PATCH(req : Request, { params } : { params: { id: string } }) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await cache.resourceItem.update(params.id, {
            data: {
                id: body.id,
                title: body.title,
                description: body.description,
                content: body.content,
                topicId: body.topicId,
                public: body.public
            }
        });
    } catch (e){
        console.error(e);
        return NextResponse.json({
            error: "Resource not found"
        }, { status: 404 });
    }
    if (body.authors)
        await cache.author.update(body.id, body.authors);
    return NextResponse.json({
        success: true
    });
}

export async function DELETE(req: Request, { params } : { params: { id: string } }) {
    const admin = await checkAdmin();
    if (admin) return admin;
    try {
        await cache.resourceItem.delete(params.id);
    } catch (e){
        return NextResponse.json({
            error: "Resource not found"
        }, { status: 404 });
    }
    cache.author.delete(params.id);
    return NextResponse.json({
        success: true
    });
}