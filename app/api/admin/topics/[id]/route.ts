import { prisma } from "@/lib/utils.server";
import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "../utils";

export async function PATCH(req : Request, { params } : { params: { id: string } }) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await prisma.topic.update({
            where: {
                id: params.id
            },
            data: {
                id: body.id,
                name: body.name,
                categoryId: body.categoryId
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Topic not found"
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
        await prisma.topic.delete({
            where: {
                id: params.id
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Topic not found"
        }, { status: 404 });
    }
    return NextResponse.json({
        success: true
    });
}