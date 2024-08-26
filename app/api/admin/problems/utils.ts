import { NextResponse } from "next/server";

interface Body {
    id: string;
    title: string;
    url: string;
    ratingEstimate: number;
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
    const fields = ["id", "title", "url", "ratingEstimate"];
    for (const field of fields){
        if (typeof body[field] !== "string"){
            return NextResponse.json({
                error: `Invalid or missing field: ${field}`
            }, {status: 400});
        }
    }
    if (typeof body.ratingEstimate !== "boolean"){
        return NextResponse.json({
            error: "Invalid or missing field: ratingEstimate"
        }, {status: 400});
    }
    return body;
}