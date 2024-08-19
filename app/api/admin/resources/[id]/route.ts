import { prisma } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "../utils";

export async function PATCH(req : Request, { params } : { params: { id: string } }) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await prisma.resourceItem.update({
            where: {
                id: params.id
            },
            data: {
                id: body.id,
                title: body.title,
                description: body.description,
                content: body.content,
                topicId: body.topicId
            }
        });
    } catch (e){
        console.error(e);
        return NextResponse.json({
            error: "Resource not found"
        }, { status: 404 });
    }
    return NextResponse.json({
        success: true
    });
}

export async function DELETE(req: Request, { params } : { params: { id: string } }) {
    const admin = await checkAdmin();
    if (admin) return admin;
    try {
        await prisma.resourceItem.delete({
            where: {
                id: params.id
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Resource not found"
        }, { status: 404 });
    }
    return NextResponse.json({
        success: true
    });
}