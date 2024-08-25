import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "./utils";
import { cache } from "@/lib/utils.server";
import { ResourceItem, User } from "@prisma/client";

export async function POST(req : Request) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        const data = (await cache.resourceItem.insert({
            data: {
                title: body.title,
                id: body.id,
                topicId: body.topicId,
                description: body.description,
                content: body.content || `This is the content for resource ${body.title}`,
                authors: {
                    connect: body.authors?.map(a => ({ id: a }))
                }
            },
            select: {
                authors: true
            }
        }) as ResourceItem & { authors: User[] });
        cache.author.insert(data.id, data.authors);
    } catch (e){
        return NextResponse.json({
            error: "Resource already exists"
        }, {status: 400});
    }
    return NextResponse.json({
        success: true
    });
}