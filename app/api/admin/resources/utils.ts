import { NextResponse } from "next/server";

interface Body {
    title: string;
    id: string;
    topicId: string;
    description: string;
    content?: string;
    public?: boolean;
    authors?: string[];
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
                error: `Invalid or missing field: ${field}`
            }, {status: 400});
        }
    }
    if (body.public !== undefined && typeof body.public !== "boolean"){
        return NextResponse.json({
            error: "Invalid field: public"
        }, {status: 400});
    }
    return body;
}