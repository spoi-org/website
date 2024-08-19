import { findUserBySessionId } from "@/lib/utils.server";
import { NextResponse } from "next/server";

export async function checkAdmin(){
    const user = await findUserBySessionId();
    if (!user){
        return NextResponse.json({
            error: "You are not logged in"
        }, {status: 401});
    }
    if (!user.admin){
        return NextResponse.json({
            error: "You are not an admin"
        }, {status: 403});
    }
    return null;
}

interface Body {
    title: string;
    id: string;
    topicId: string;
    description: string;
    content?: string;
}

export async function getBody(req: Request) : Promise<Body | NextResponse> {
    let body;
    try {
        body = await req.json();
    } catch (e){
        return NextResponse.json({
            error: "Invalid JSON"
        }, {status: 400});
    }
    const fields = ["title", "id", "topicId", "description", "content"];
    for (const field of fields){
        if (typeof body[field] !== "string"){
            if (field === "description" && body.description === null) continue;
            if (field === "content" && body.content === undefined) continue;
            return NextResponse.json({
                error: `Missing field: ${field}`
            }, {status: 400});
        }
    }
    return body;
}