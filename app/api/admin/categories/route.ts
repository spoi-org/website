import { NextResponse } from "next/server";
import { checkAdmin, getBody } from "./utils";
import { prisma } from "@/lib/utils.server";

export async function POST(req : Request) {
    const admin = await checkAdmin();
    if (admin) return admin;
    const body = await getBody(req);
    if (body instanceof NextResponse) return body;
    try {
        await prisma.category.create({
            data: {
                name: body.name,
                id: body.id
            }
        });
    } catch (e){
        return NextResponse.json({
            error: "Category already exists"
        }, {status: 400});
    }
    return NextResponse.json({
        success: true
    });
}